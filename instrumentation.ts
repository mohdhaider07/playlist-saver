/**
 * Next.js Instrumentation file
 *
 * The `register` function is called once when a new Next.js server instance
 * is initiated. This is the correct place to initialize server-startup tasks
 * like cron jobs, which require Node.js native modules (e.g. node:crypto).
 */
export async function register() {
  // Only initialize cron in the Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeYoutubePlaylistCron } = await import(
      "@/lib/cron-scheduler"
    );
    initializeYoutubePlaylistCron();
  }
}
