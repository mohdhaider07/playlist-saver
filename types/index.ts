export interface UserDocument {
  _id: string;
  name?: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  otpCode: string | null;
  otpExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistVideoItem {
  position: number;
  youtubeVideoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  channelTitle: string;
}

export interface PlaylistDocument {
  id?: string;
  _id: string;
  userId: string;
  youtubePlaylistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoCount: number;
  videos: PlaylistVideoItem[];
  addedAt: Date;
  updatedAt: Date;
}

export interface ProgressDocument {
  _id: string;
  userId: string;
  playlistId: string;
  youtubeVideoId: string;
  watchedSeconds: number;
  durationSeconds: number;
  percentComplete: number;
  isCompleted: boolean;
  lastWatchedAt: Date;
}

export interface AuthPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface PlaylistFormatted {
  id: string;
  youtubePlaylistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoCount: number;
  addedAt: Date;
  completedCount?: number;
  progressPercent?: number;
}

export interface ProgressMap {
  [youtubeVideoId: string]: {
    watchedSeconds: number;
    durationSeconds: number;
    percentComplete: number;
    isCompleted: boolean;
    lastWatchedAt: Date;
  };
}

export interface YoutubeVideoSnapshot {
  _id: string;
  youtubeVideoId: string;
  title: string;
  addedAt: Date;
}

export interface YoutubePlaylistCheckLog {
  _id: string;
  checkDate: Date;
  newVideosFound: string[];
  totalVideosInDb: number;
  apiCallStatus: "success" | "failed";
  error?: string;
}
