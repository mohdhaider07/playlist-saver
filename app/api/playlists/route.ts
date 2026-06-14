import { NextRequest, NextResponse } from "next/server";
import { getPlaylistsCollection, getProgressCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import {
  getPlaylistMetadata,
  getPlaylistItems,
  getVideoDurations,
  getYouTubeThumbnailUrl,
  parseISO8601Duration,
} from "@/lib/youtube";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

// GET /api/playlists — list all playlists for authenticated user with progress stats
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const playlistsCol = await getPlaylistsCollection();
    const progressCol = await getProgressCollection();

    // Do not return `videos` array here
    const playlists = await playlistsCol
      .find({ userId: user.id }, { projection: { videos: 0 } })
      .sort({ addedAt: -1 })
      .toArray();

    // Fetch progress for this user
    const progressRecords = await progressCol
      .find({ userId: user.id })
      .toArray();

    // Map progress records by playlistId
    const progressByPlaylist: Record<string, typeof progressRecords> = {};
    progressRecords.forEach((rec) => {
      const pid = rec.playlistId;
      if (!progressByPlaylist[pid]) {
        progressByPlaylist[pid] = [];
      }
      progressByPlaylist[pid].push(rec);
    });

    const formatted = playlists.map((p) => {
      const pIdStr = p._id.toString();
      const records = progressByPlaylist[pIdStr] || [];
      const completedCount = records.filter((r) => r.isCompleted).length;
      
      const progressPercent = p.videoCount > 0
        ? Math.min(Math.round((completedCount / p.videoCount) * 100), 100)
        : 0;

      return {
        id: pIdStr,
        youtubePlaylistId: p.youtubePlaylistId,
        title: p.title,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        channelTitle: p.channelTitle,
        videoCount: p.videoCount,
        addedAt: p.addedAt,
        completedCount,
        progressPercent,
      };
    });

    return NextResponse.json(
      { playlists: formatted },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("[GET /api/playlists]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// POST /api/playlists — add a new playlist by URL
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { playlistUrl } = await request.json();

    if (!playlistUrl) {
      return NextResponse.json(
        { error: "playlistUrl is required." },
        { status: 400 }
      );
    }

    let youtubePlaylistId = "";
    try {
      const urlObj = new URL(playlistUrl);
      youtubePlaylistId = urlObj.searchParams.get("list") || "";
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!youtubePlaylistId) {
      return NextResponse.json(
        { error: "No list parameter found in URL" },
        { status: 400 }
      );
    }

    // Validate playlist ID format
    if (!/^(PL|FL|RD|UU|OL)/.test(youtubePlaylistId)) {
      return NextResponse.json(
        { error: "Invalid playlist ID format detected in URL." },
        { status: 400 }
      );
    }

    const playlistsCol = await getPlaylistsCollection();
    const existing = await playlistsCol.findOne({
      userId: user.id,
      youtubePlaylistId,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Playlist already added." },
        { status: 409 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("Server missing YOUTUBE_API_KEY");
    }

    const metadata = await getPlaylistMetadata(youtubePlaylistId, apiKey);
    const items = await getPlaylistItems(youtubePlaylistId, apiKey);
    const videoIds = items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.snippet.resourceId?.videoId || item.contentDetails?.videoId)
      .filter(Boolean);
    const durations = await getVideoDurations(videoIds, apiKey);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videos = items.map((item: any) => {
      const videoId =
        item.snippet.resourceId?.videoId || item.contentDetails?.videoId;
      const durationStr = durations[videoId] || "PT0S";
      return {
        position: item.snippet.position,
        youtubeVideoId: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          getYouTubeThumbnailUrl(videoId),
        duration: durationStr,
        durationSeconds: parseISO8601Duration(durationStr),
        channelTitle:
          item.snippet.channelTitle ||
          item.snippet.videoOwnerChannelTitle ||
          "",
      };
    });

    const newDoc = {
      userId: user.id,
      youtubePlaylistId,
      title: metadata.title,
      description: metadata.description,
      thumbnailUrl: metadata.thumbnailUrl,
      channelTitle: metadata.channelTitle,
      videoCount: videos.length,
      videos,
      addedAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await playlistsCol.insertOne(newDoc);

    const formatted = {
      id: result.insertedId.toString(),
      youtubePlaylistId,
      title: metadata.title,
      description: metadata.description,
      thumbnailUrl: metadata.thumbnailUrl,
      channelTitle: metadata.channelTitle,
      videoCount: videos.length,
      addedAt: newDoc.addedAt,
      completedCount: 0,
      progressPercent: 0,
    };

    return NextResponse.json(
      { playlist: formatted },
      { status: 201, headers: NO_STORE_HEADERS }
    );
  } catch (error: unknown) {
    console.error("[POST /api/playlists]", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Playlist not found or is private.") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "YouTube API Error: " + message },
      { status: 502 }
    );
  }
}
