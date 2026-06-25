import axios from "axios";
import {
  getYoutubeVideoSnapshotsCollection,
  getYoutubePlaylistCheckLogsCollection,
} from "./db";
import { sendEmail } from "./email-service";

interface YoutubeVideoItem {
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    resourceId: {
      videoId: string;
    };
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

interface YoutubeApiResponse {
  items: YoutubeVideoItem[];
}

interface StoredVideoTitle {
  title: string;
}

const YOUTUBE_API_URL =
  "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId=UU-CSyyi47VX1lD9zyeABW3w&key=AIzaSyAuDl-TW3vtLe9aUzAPBkXo8DpOWNJ9ilw";
const NOTIFICATION_EMAIL = "haiderahmed12786@gmail.com";

export async function runYoutubePlaylistCheck(): Promise<void> {
  try {
    console.log("Starting YouTube playlist check...");

    // Fetch latest videos from YouTube API
    const youtubeVideos = await fetchYoutubeVideos();
    console.log(`Fetched ${youtubeVideos.length} videos from YouTube API`);

    // Get existing videos from database
    const videosCollection = await getYoutubeVideoSnapshotsCollection();
    const existingVideos = await videosCollection
      .find<StoredVideoTitle>({}, { projection: { title: 1, _id: 0 } })
      .sort({ addedAt: -1 })
      .toArray();

    // Create a map of existing video titles for comparison
    const existingTitles = new Set(existingVideos.map((v) => v.title));

    // Find new videos
    const newVideos = youtubeVideos.filter(
      (video) => !existingTitles.has(video.snippet.title),
    );

    console.log(`Found ${newVideos.length} new videos compared to database`);

    // If there are new videos, send notification email
    if (newVideos.length > 0) {
      await sendNewVideoNotification(newVideos);
      console.log("Notification email sent for new videos");
    }

    // Update database - keep only the latest 6 videos
    await updateVideoDatabase(youtubeVideos);
    console.log("Database updated with latest 6 videos");

    // Log the check
    const logsCollection = await getYoutubePlaylistCheckLogsCollection();
    await logsCollection.insertOne({
      checkDate: new Date(),
      newVideosFound: newVideos.map((v) => v.snippet.title),
      totalVideosInDb: 6,
      apiCallStatus: "success",
    });

    console.log("YouTube playlist check completed successfully");
  } catch (error) {
    console.error("Error running YouTube playlist check:", error);

    // Log the failed check
    try {
      const logsCollection = await getYoutubePlaylistCheckLogsCollection();
      await logsCollection.insertOne({
        checkDate: new Date(),
        newVideosFound: [],
        totalVideosInDb: 0,
        apiCallStatus: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    } catch (logError) {
      console.error("Failed to log the error:", logError);
    }
  }
}

async function fetchYoutubeVideos(): Promise<YoutubeVideoItem[]> {
  const config = {
    method: "get" as const,
    maxBodyLength: Infinity,
    url: YOUTUBE_API_URL,
    headers: {
      accept: "application/json",
      "accept-language": "en-GB,en;q=0.8",
      origin: "https://youtube.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  };

  try {
    const response = await axios.request<YoutubeApiResponse>(config);
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}

async function sendNewVideoNotification(
  newVideos: YoutubeVideoItem[],
): Promise<void> {
  if (!NOTIFICATION_EMAIL) return;

  const videoList = newVideos
    .map((video, index) => `${index + 1}. ${video.snippet.title}`)
    .join("<br/>");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #C5A059;">New YouTube Videos Found</h2>
      <p>The following new videos have been added to the playlist:</p>
      <div style="background-color: #F5F4F0; padding: 15px; border-left: 4px solid #C5A059; margin: 20px 0;">
        ${videoList}
      </div>
      <p style="color: #78716C; font-size: 12px;">
        Check: ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  await sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: `🎬 ${newVideos.length} New YouTube Video${newVideos.length > 1 ? "s" : ""} Found`,
    html,
    lng: "en",
  });
}

async function updateVideoDatabase(
  youtubeVideos: YoutubeVideoItem[],
): Promise<void> {
  const videosCollection = await getYoutubeVideoSnapshotsCollection();

  // Delete all existing videos
  await videosCollection.deleteMany({});

  // Insert the latest 6 videos
  const videosToInsert = youtubeVideos.map((video) => ({
    youtubeVideoId: video.snippet.resourceId.videoId,
    title: video.snippet.title,
    addedAt: new Date(),
  }));

  if (videosToInsert.length > 0) {
    await videosCollection.insertMany(videosToInsert);
  }
}
