import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getPlaylistsCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import {
  getVideoMetadata,
  parseYouTubeUrl,
  parseISO8601Duration,
} from "@/lib/youtube";
import { addVideoToPlaylistSchema } from "@/lib/validation";
import { PlaylistVideoItem } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { playlistId } = await params;

    if (!ObjectId.isValid(playlistId)) {
      return NextResponse.json(
        { error: "Invalid playlist ID format" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = addVideoToPlaylistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const parsedUrl = parseYouTubeUrl(parsed.data.videoUrl);
    if (!parsedUrl || parsedUrl.type !== "video" || !parsedUrl.id) {
      return NextResponse.json(
        { error: "Please provide a valid YouTube video URL." },
        { status: 400 }
      );
    }

    const videoId = parsedUrl.id;

    const playlistsCol = await getPlaylistsCollection();
    const playlist = await playlistsCol.findOne({
      _id: new ObjectId(playlistId),
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    if (playlist.userId !== user.id) {
      return NextResponse.json(
        { error: "Playlist belongs to another user" },
        { status: 403 }
      );
    }

    const isCustom = Boolean(
      playlist.isCustom || playlist.youtubePlaylistId?.startsWith("video-")
    );

    if (!isCustom) {
      return NextResponse.json(
        { error: "Videos can only be added to custom/single-video playlists." },
        { status: 400 }
      );
    }

    const currentVideos: PlaylistVideoItem[] = playlist.videos || [];
    const alreadyExists = currentVideos.some(
      (v) => v.youtubeVideoId === videoId
    );

    if (alreadyExists) {
      return NextResponse.json(
        { error: "This video is already in the playlist." },
        { status: 409 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("Server missing YOUTUBE_API_KEY");
    }

    const videoMeta = await getVideoMetadata(videoId, apiKey);
    const durationSeconds = parseISO8601Duration(videoMeta.duration);

    const newVideo: PlaylistVideoItem = {
      position: currentVideos.length,
      youtubeVideoId: videoId,
      title: videoMeta.title,
      description: videoMeta.description,
      thumbnailUrl: videoMeta.thumbnailUrl,
      duration: videoMeta.duration,
      durationSeconds,
      channelTitle: videoMeta.channelTitle,
    };

    await playlistsCol.updateOne(
      { _id: new ObjectId(playlistId) },
      {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      $push: { videos: newVideo } as any,
      $inc: { videoCount: 1 },
      $set: { isCustom: true, updatedAt: new Date() },
    }
    );

    return NextResponse.json(
      {
        message: "Video added successfully.",
        video: newVideo,
        videoCount: currentVideos.length + 1,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/playlists/:playlistId/videos]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message.includes("not found") || message.includes("private")) {
      return NextResponse.json(
        { error: "Video not found or is private." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred while adding the video." },
      { status: 500 }
    );
  }
}
