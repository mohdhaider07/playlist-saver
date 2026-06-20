export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
}

export async function getPlaylistMetadata(
  playlistId: string,
  apiKey: string
) {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.items || data.items.length === 0) {
    throw new Error("Playlist not found or is private.");
  }

  const snippet = data.items[0].snippet;
  const contentDetails = data.items[0].contentDetails;

  return {
    title: snippet.title,
    description: snippet.description,
    channelTitle: snippet.channelTitle,
    thumbnailUrl:
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      "",
    videoCount: contentDetails.itemCount,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPlaylistItems(playlistId: string, apiKey: string): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allItems: any[] = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message ||
          "Error fetching playlist items from YouTube API."
      );
    }

    if (data.items) {
      allItems = allItems.concat(data.items);
    }

    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return allItems;
}

export async function getVideoDurations(
  videoIds: string[],
  apiKey: string
): Promise<Record<string, string>> {
  const durations: Record<string, string> = {};

  // YouTube API allows max 50 ids per request
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batch.join(",")}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items.forEach((item: any) => {
        durations[item.id] = item.contentDetails.duration;
      });
    }
  }

  return durations;
}

export async function getVideoMetadata(
  videoId: string,
  apiKey: string
) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.items || data.items.length === 0) {
    throw new Error("Video not found or is private.");
  }

  const snippet = data.items[0].snippet;
  const contentDetails = data.items[0].contentDetails;

  return {
    title: snippet.title,
    description: snippet.description || "",
    channelTitle: snippet.channelTitle || "",
    thumbnailUrl:
      snippet.thumbnails?.maxres?.url ||
      snippet.thumbnails?.high?.url ||
      snippet.thumbnails?.medium?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: contentDetails.duration || "PT0S",
  };
}

