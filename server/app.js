import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";
import { notFound } from "./middleware/notFound.js";
import { StatusCodes } from "http-status-codes";

import { connectDB } from "./connectDB/connectDB.js";
import { auth } from "./middleware/authorization.js";
import authRouter from "./router/auth.js";
import mangaRouter from "./router/manga.js";
import cookieParser from "cookie-parser";
import axios from "axios";

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API spining!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/manga", mangaRouter);
// test route
app.get("/api/v1/users", auth, (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Yahoo you made it!" });
});

// get the id of any manga by name
const baseUrl = "https://api.mangadex.org";
app.get("/api/v1/getManga", async (req, res) => {
  const { title, authorOrArtist } = req.body;
  try {
    const response = await axios.get(`${baseUrl}/manga`, {
      params: {
        title,
        authorOrArtist,
      },
    });
    res.status(StatusCodes.OK).json({ data: response.data.data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
});

// response id by name
// const berserkById = "801513ba-a712-498c-8f57-cae55b38cc92";

// get all chapters by id
app.get("/api/v1/getChapter", async (req, res) => {
  const { mangaId } = req.body;
  try {
    const response = await axios.get(`${baseUrl}/manga/${mangaId}/feed`, {
      params: {
        translatedLanguage: ["en"], // Fetch chapters in English; modify if needed
        limit: 2, // Adjust to control how many chapters per request (up to 500 max)
        offset: 1,
        order: { chapter: "asc" }, // Order chapters in ascending order
      },
    });
    const data = response.data.data.map((chapter) => chapter.id);
    res.status(StatusCodes.OK).json({ data: response.data.data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
});

// get images of chapters
app.get("/api/v1/chapter", async (req, res) => {
  const { chapterId } = req.body;
  try {
    const response = await axios.get(
      `https://api.mangadex.org/at-home/server/${chapterId}`
    );
    const baseUrl = response.data.baseUrl;
    const hash = response.data.chapter.hash;
    const mangaImgs = response.data.chapter.data.map((val) => {
      return `${baseUrl}/data/${hash}/${val}`;
    });

    res.status(StatusCodes.OK).json({ data: mangaImgs });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
});

app.get("/api/v1/cover/:mangaId", async (req, res) => {
  const { mangaId } = req.params;

  try {
    const response = await axios.get(`https://api.mangadex.org/cover`, {
      params: {
        manga: [mangaId], // Array of manga IDs
        limit: 2, // Limit to 5 results per request
        offset: 0,
        order: {
          volume: "desc",
        },
        includes: ["manga"],
      },
    });

    const fileName = response.data.data[0]?.attributes?.fileName;
    const coverImageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    res.status(StatusCodes.OK).json({ coverImageUrl });
  } catch (error) {
    console.log(error);
  }
});

app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server listening to PORT ${PORT} ...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
