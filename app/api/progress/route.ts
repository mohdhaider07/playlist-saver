import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getProgressCollection } from "@/lib/db";
import { getAuthUser } from "@/lib/auth-helpers";

// POST /api/progress — save watch progress for a video
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { playlistId, youtubeVideoId, watchedSeconds, durationSeconds } =
      await request.json();

    if (
      !playlistId ||
      !youtubeVideoId ||
      watchedSeconds == null ||
      durationSeconds == null
    ) {
      return NextResponse.json(
        {
          error:
            "playlistId, youtubeVideoId, watchedSeconds, and durationSeconds are required.",
        },
        { status: 400 }
      );
    }

    if (durationSeconds <= 0) {
      return NextResponse.json(
        { error: "durationSeconds must be > 0" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(playlistId)) {
      return NextResponse.json(
        { error: "Invalid playlistId format" },
        { status: 400 }
      );
    }

    const percentComplete =
      Math.round(
        (Math.min(watchedSeconds, durationSeconds) / durationSeconds) * 10000
      ) / 100;
    const isCompleted = percentComplete >= 90;

    const progressCol = await getProgressCollection();

    await progressCol.findOneAndUpdate(
      { userId: user.id, youtubeVideoId, playlistId },
      {
        $set: {
          watchedSeconds: Math.min(watchedSeconds, durationSeconds),
          durationSeconds,
          percentComplete,
          isCompleted,
          lastWatchedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "Progress saved." });
  } catch (error) {
    console.error("[POST /api/progress]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// GET /api/progress?playlistId=xxx — get progress for a playlist
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get("playlistId");

    if (!playlistId || !ObjectId.isValid(playlistId)) {
      return NextResponse.json(
        { error: "Valid playlistId query string is required." },
        { status: 400 }
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

    return NextResponse.json({ progress: progressMap });
  } catch (error) {
    console.error("[GET /api/progress]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
