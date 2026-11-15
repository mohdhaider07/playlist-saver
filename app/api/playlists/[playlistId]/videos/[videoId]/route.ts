import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getPlaylistsCollection, getProgressCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";
import { PlaylistVideoItem } from "@/types";

// DELETE /api/playlists/[playlistId]/videos/[videoId] — remove a video from a custom playlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string; videoId: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { playlistId, videoId } = await params;

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

    const isCustom = Boolean(
      playlist.isCustom || playlist.youtubePlaylistId?.startsWith("video-")
    );

    if (!isCustom) {
      return NextResponse.json(
        { error: "Videos can only be removed from custom playlists." },
        { status: 400 }
      );
    }

    const currentVideos: PlaylistVideoItem[] = playlist.videos || [];
    const removedIndex = currentVideos.findIndex(
      (v) => v.youtubeVideoId === videoId
    );

    if (removedIndex === -1) {
      return NextResponse.json(
        { error: "Video not found in playlist." },
        { status: 404 }
      );
    }

    const removedVideo = currentVideos[removedIndex];
    const remainingVideos = currentVideos
      .filter((_, index) => index !== removedIndex)
      .map((video, index) => ({ ...video, position: index }));

    const updateFields: Record<string, unknown> = {
      videos: remainingVideos,
      videoCount: remainingVideos.length,
      updatedAt: new Date(),
    };

    // Custom playlists use their first video's thumbnail as the cover
    if (playlist.thumbnailUrl === removedVideo.thumbnailUrl) {
      const nextCover = remainingVideos[0];
      updateFields.thumbnailUrl = nextCover
        ? nextCover.thumbnailUrl ||
          getYouTubeThumbnailUrl(nextCover.youtubeVideoId)
        : "";
    }

    await playlistsCol.updateOne(
      { _id: new ObjectId(playlistId) },
      { $set: updateFields }
    );

    const progressCol = await getProgressCollection();
    await progressCol.deleteMany({
      userId: user.id,
      playlistId,
      youtubeVideoId: videoId,
    });

    return NextResponse.json({
      message: "Video removed successfully.",
      videoCount: remainingVideos.length,
    });
  } catch (error) {
    console.error("[DELETE /api/playlists/:playlistId/videos/:videoId]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
