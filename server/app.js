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
import cookieParser from "cookie-parser";
import axios from "axios";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API spining!");
});

app.use("/api/v1/auth", authRouter);
// test route
app.get("/api/v1/users", auth, (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Yahoo you made it!" });
});

// get the id of any manga by name
const baseUrl = "https://api.mangadex.org";
app.get("/api/v1/getManga", async (req, res) => {
  const { title } = req.body;
  try {
    const response = await axios.get(`${baseUrl}/manga`, {
      params: {
        title,
        authorOrArtist: "508631f5-09de-4ae1-87ed-4b6179254ca1",
      },
    });
    res.status(StatusCodes.OK).json({ data: response.data.data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
});

// response id by name
const berserkById = "801513ba-a712-498c-8f57-cae55b38cc92";

// get all chapters by id
app.get("/api/v1/getChapter", async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/manga/${berserkById}/feed`, {
      params: {
        translatedLanguage: ["en"], // Fetch chapters in English; modify if needed
        limit: 2, // Adjust to control how many chapters per request (up to 500 max)
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
    res.status(StatusCodes.OK).json({ data: response.data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
});

app.get("/api/v1/cover", async (req, res) => {
  const { mangaId } = req.body;
  try {
    const response = await axios.get(
      `https://api.mangadex.org/cover?manga[]=${mangaId}`
    );
    const fileName = response.data.data[0].attributes.fileName;
    const coverImageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
    res.status(StatusCodes.OK).json({ coverImageUrl });
  } catch (error) {
    console.log(error);
  }
});

// const getCoverArt = async () => {
//   try {
//     const response = await axios.get(
//       `https://api.mangadex.org/cover?manga[]=${mangaId}`
//     );
//     const fileName = response.data.data[0].attributes.fileName;
//     const coverImageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
//     console.log("Cover Art URL:", coverImageUrl);
//   } catch (error) {
//     console.error("Failed to fetch cover art:", error);
//   }
// };

// getCoverArt();

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
