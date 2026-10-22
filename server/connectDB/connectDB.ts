import mongoose from "mongoose";

export const connectDB = (url: string): Promise<typeof mongoose> =>
  mongoose.connect(url);
