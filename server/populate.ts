import { config } from "dotenv";
config();

import { caseManga } from "./caseManga.js";
import Manga from "./models/manga.js";
import { connectDB } from "./connectDB/connectDB.js";

const start = async (): Promise<void> => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    await Manga.create(caseManga);
    console.log("Success!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
