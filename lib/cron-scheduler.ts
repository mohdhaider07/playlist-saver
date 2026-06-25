import cron, { ScheduledTask } from "node-cron";
import { runYoutubePlaylistCheck } from "./youtube-cron";

let cronJob: ScheduledTask | null = null;

export function initializeYoutubePlaylistCron(): void {
  if (cronJob) {
    console.log("YouTube playlist cron job already initialized");
    return;
  }

  // Run every Saturday at 7:00 PM (19:00)
  // Cron expression: 0 19 * * 6 (minute hour day month dayOfWeek)
  // dayOfWeek: 0=Sunday, 6=Saturday
  cronJob = cron.schedule("0 19 * * 6", async () => {
    console.log("Running scheduled YouTube playlist check...");
    try {
      await runYoutubePlaylistCheck();
    } catch (error) {
      console.error("Scheduled YouTube playlist check failed:", error);
    }
  });

  console.log(
    "YouTube playlist cron job initialized (every Saturday at 7:00 PM)",
  );
}

export function stopYoutubePlaylistCron(): void {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log("YouTube playlist cron job stopped");
  }
}
