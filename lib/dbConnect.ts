import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((conn) => conn)
      .catch((err) => {
        // reset promise so subsequent attempts can retry
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err: any) {
    throw new Error(`Failed to connect to MongoDB: ${err && err.message ? err.message : String(err)}`);
  }
}
