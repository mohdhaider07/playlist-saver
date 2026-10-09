# MyTaalim Core Features & Capabilities

This document provides a comprehensive overview of the core functional features, workflows, and domain state models within the MyTaalim platform. All new features and enhancements must align with these established workflows.

---

## 1. YouTube Course & Video Ingestion

### Playlist Ingestion
- **Source**: YouTube Playlist URL or Playlist ID.
- **Service**: Integrates with YouTube Data API v3 via [`lib/youtube.ts`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/lib/youtube.ts).
- **Processing**:
  - Fetches snippet metadata (`title`, `description`, `thumbnailUrl`, `channelTitle`, `videoCount`).
  - Iterates through all playlist items, resolving paginated tokens up to API limits.
  - Batches video IDs (chunks of 50) to fetch content details and parse ISO 8601 durations (`PT#M#S`) into exact seconds.
  - Stores normalized playlist and video array in MongoDB [`playlists`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/lib/db.ts) collection.

### Single Video Ingestion (Custom Playlists)
- **Source**: Individual YouTube Video URL or Video ID.
- **Behavior**:
  - Automatically initializes a custom playlist container with `isCustom: true`.
  - Sets the video as the initial item at position 0.
  - Allows users to incrementally expand the playlist over time.

---

## 2. Custom Playlist Management

- **Add Videos**:
  - Users can append additional YouTube videos to any custom playlist via a modal dialog in the player sidebar (`POST /api/playlists/[playlistId]/videos` or `PATCH /api/playlists/[playlistId]`).
  - Fetches video metadata and duration on-the-fly and recalculates playlist total duration and video count.
- **Rename Playlist**:
  - Allows updating the custom playlist title directly from the player header or playlist actions.
- **Delete Playlist**:
  - Deletes playlist record from MongoDB and cascades deletion of all associated user progress records.

---

## 3. Distraction-Free Learning Player

- **Player Interface** (`app/[lang]/(protected)/playlist/[playlistId]/`):
  - Clean, cinema-style environment removing YouTube recommendations, comments, and ads.
  - Powered by custom YouTube IFrame Player API hook ([`use-youtube-player.ts`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/hooks/use-youtube-player.ts)).
- **Playlist Queue Sidebar**:
  - Sequential video list with thumbnail, title, channel, duration badge, and completion checkmark.
  - Active video highlighted with Nobel Gold accent and pulsing equalizer animation (`.eq-bar`).
  - Auto-scrolls the active video into view on track change.

---

## 4. Real-Time Progress Tracking & Analytics

- **Granular Video Progress**:
  - Periodically persists playback position (`watchedSeconds`, `durationSeconds`, `percentComplete`, `isCompleted`, `lastWatchedAt`) to the database ([`progress`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/lib/db.ts) collection).
  - Automatically marks video as completed when reaching $\ge 90\%$ playback or upon completion event.
- **Playlist Level Aggregations**:
  - Computes `completedCount` and overall `progressPercent` across all constituent videos.
  - Reflects dynamic progress bar on dashboard playlist cards.
- **Dashboard Overview Metrics**:
  - Real-time stat counters: Total Courses, In Progress, Completed, and Total Videos Tracked.

---

## 5. Playlist Lifecycle & Smart Filtering

- **Lifecycle States**:
  - `in_progress`: Actively tracked course with incomplete items.
  - `completed`: All items finished or manually marked completed by user.
- **Quick Status Toggle**:
  - Users can toggle playlist status directly from dashboard card actions.
- **Dashboard Filters**:
  - **Status Tabs**: Quick switch between *In Progress* (default view), *Completed*, and *All*.
  - **Channel Filter**: Filter courses by YouTube creator/channel name.
  - **Search**: Instant client-side search filtering by playlist title or video titles.

---

## 6. Authentication & Account Security

- **Multi-Factor Email Verification**:
  - 6-digit OTP sent via Resend on registration and password reset.
  - Expiring OTP lifecycle (10 minutes) stored with user document.
- **Guest Access**:
  - 1-click instant guest login for evaluating the platform without creating an account.
- **Synchronized Session**:
  - JWT verified in Next.js Proxy ([`proxy.ts`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/proxy.ts)) with matching `httpOnly` cookie lifespan.
  - Automatic session cleanup on token expiry.

---

## 7. Bilingual & Directional Experience

- **Locales**: Full feature parity across English (`en`) and Arabic (`ar`).
- **RTL Alignment**: Automatic document directionality (`dir="rtl"`), typographic fallbacks, and mirrored layout flows for Arabic users.
- **Localized Content**: All error messages, UI strings, confirmation dialogs, and email templates localized via [`lib/i18n/dictionaries.ts`](file:///Users/mohdakbar/Desktop/Haider/Project/playzen/lib/i18n/dictionaries.ts).
