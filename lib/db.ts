import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB_NAME =
  process.env.MONGODB_DB_NAME || "youtube_playlist_manager";

const options = {};

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient
  // is not recreated on every HMR (Hot Module Replacement) update.
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  const client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(MONGODB_DB_NAME);
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection("users");
}

export async function getPlaylistsCollection() {
  const db = await getDb();
  return db.collection("playlists");
}

export async function getProgressCollection() {
  const db = await getDb();
  return db.collection("progress");
}

export async function getYoutubeVideoSnapshotsCollection() {
  const db = await getDb();
  return db.collection("youtube_video_snapshots");
}

export async function getYoutubePlaylistCheckLogsCollection() {
  const db = await getDb();
  return db.collection("youtube_playlist_check_logs");
}
