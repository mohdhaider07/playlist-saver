import { NextRequest, NextResponse } from "next/server";
import { getPlaylistsCollection, getProgressCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";
import {
  getPlaylistMetadata,
  getPlaylistItems,
  getVideoDurations,
  getYouTubeThumbnailUrl,
  parseISO8601Duration,
  getVideoMetadata,
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

function parseYouTubeUrl(urlStr: string) {
  try {
    const trimmed = urlStr.trim();
    if (!trimmed) return null;

    const urlWithProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const urlObj = new URL(urlWithProtocol);

    // Validate hostname
    const isYouTube = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(urlWithProtocol);
    if (!isYouTube) return null;

    // 1. Priority: check list parameter (playlist)
    const listId = urlObj.searchParams.get("list");
    if (listId) {
      return { type: "playlist" as const, id: listId };
    }

    // 2. Second: check video parameters/pathname
    let videoId = "";
    if (urlObj.hostname.includes("youtu.be")) {
      // youtu.be/VIDEO_ID
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.pathname.startsWith("/watch")) {
      videoId = urlObj.searchParams.get("v") || "";
    } else if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/")[2] || "";
    } else if (urlObj.pathname.startsWith("/embed/")) {
      videoId = urlObj.pathname.split("/")[2] || "";
    }

    if (videoId) {
      return { type: "video" as const, id: videoId };
    }

    return null;
  } catch {
    // Fallback simple regex parsing in case of URL parse failure
    const trimmed = urlStr.trim();
    const hasList = /[&?]list=([^&]+)/i.exec(trimmed);
    if (hasList && hasList[1]) {
      return { type: "playlist" as const, id: hasList[1] };
    }

    const hasVideo = /(?:watch\?v=|shorts\/|embed\/|\.be\/)([^&?/]+)/i.exec(trimmed);
    if (hasVideo && hasVideo[1]) {
      return { type: "video" as const, id: hasVideo[1] };
    }

    return null;
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

    const parsed = parseYouTubeUrl(playlistUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const { type, id } = parsed;

    if (type === "playlist") {
      // Validate playlist ID format
      if (!/^(PL|FL|RD|UU|OL)/.test(id)) {
        return NextResponse.json(
          { error: "Invalid playlist ID format detected in URL." },
          { status: 400 }
        );
      }
    }

    const youtubePlaylistId = type === "playlist" ? id : `video-${id}`;

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

    let metadata: {
      title: string;
      description: string;
      channelTitle: string;
      thumbnailUrl: string;
      videoCount: number;
    };
    let videos: {
      position: number;
      youtubeVideoId: string;
      title: string;
      description: string;
      thumbnailUrl: string;
      duration: string;
      durationSeconds: number;
      channelTitle: string;
    }[];

    if (type === "playlist") {
      const playlistMeta = await getPlaylistMetadata(id, apiKey);
      const items = await getPlaylistItems(id, apiKey);
      const videoIds = items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.snippet.resourceId?.videoId || item.contentDetails?.videoId)
        .filter(Boolean);
      const durations = await getVideoDurations(videoIds, apiKey);

      metadata = playlistMeta;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      videos = items.map((item: any) => {
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
    } else {
      const videoMeta = await getVideoMetadata(id, apiKey);
      metadata = {
        title: videoMeta.title,
        description: videoMeta.description,
        channelTitle: videoMeta.channelTitle,
        thumbnailUrl: videoMeta.thumbnailUrl,
        videoCount: 1,
      };
      videos = [
        {
          position: 0,
          youtubeVideoId: id,
          title: videoMeta.title,
          description: videoMeta.description,
          thumbnailUrl: videoMeta.thumbnailUrl,
          duration: videoMeta.duration,
          durationSeconds: parseISO8601Duration(videoMeta.duration),
          channelTitle: videoMeta.channelTitle,
        },
      ];
    }

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
