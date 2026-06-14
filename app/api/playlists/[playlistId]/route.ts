import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getPlaylistsCollection, getProgressCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { PlaylistVideoItem } from "@/types";

// GET /api/playlists/[playlistId] — get single playlist with progress
export async function GET(
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

    const progressCol = await getProgressCollection();
    const progressRecords = await progressCol
      .find({ userId: user.id, playlistId })
      .toArray();

    const progressMap: Record<string, object> = {};
    progressRecords.forEach((p) => {
      progressMap[p.youtubeVideoId] = {
        watchedSeconds: p.watchedSeconds,
        durationSeconds: p.durationSeconds,
        percentComplete: p.percentComplete,
        isCompleted: p.isCompleted,
        lastWatchedAt: p.lastWatchedAt,
      };
    });

    const videos = playlist.videos.map((video: PlaylistVideoItem) => ({
      ...video,
      thumbnailUrl:
        video.thumbnailUrl || getYouTubeThumbnailUrl(video.youtubeVideoId),
    }));

    const formatted = {
      id: playlist._id.toString(),
      youtubePlaylistId: playlist.youtubePlaylistId,
      title: playlist.title,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      channelTitle: playlist.channelTitle,
      videoCount: playlist.videoCount,
      videos,
      addedAt: playlist.addedAt,
    };

    return NextResponse.json({ playlist: formatted, progress: progressMap });
  } catch (error) {
    console.error("[GET /api/playlists/:id]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// DELETE /api/playlists/[playlistId] — delete a playlist and its progress
export async function DELETE(
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

    const playlistsCol = await getPlaylistsCollection();
    const progressCol = await getProgressCollection();

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

    await playlistsCol.deleteOne({ _id: new ObjectId(playlistId) });
    await progressCol.deleteMany({ userId: user.id, playlistId });

    return NextResponse.json({ message: "Playlist deleted." });
  } catch (error) {
    console.error("[DELETE /api/playlists/:id]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
