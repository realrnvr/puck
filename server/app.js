import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

// import "./populate.js";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";
import { notFound } from "./middleware/notFound.js";
import { connectDB } from "./connectDB/connectDB.js";
import { auth } from "./middleware/authorization.js";
import { redisClient } from "./config/redisClient.js";
import { sendNewsLetter } from "./services/newsletter.js";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import nodeCron from "node-cron";
import cookieParser from "cookie-parser";
// routers
import authRouter from "./router/auth.js";
import mangaRouter from "./router/manga.js";
import clientRouter from "./router/client.js";
import newsletterRouter from "./router/newsletter.js";

app.use(
  cors({
    origin: process.env.CLIENT_APP_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// health check

app.get("/", (req, res) => {
  res.send("API spining!");
});

app.get("/api/v1/ping", (req, res) => {
  res.status(StatusCodes.OK).send("PONG!");
});

// ... //

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/manga", mangaRouter);
app.use("/api/v1/client", auth, clientRouter);
app.use("/api/v1/newsletter", newsletterRouter);

// test //
import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

app.get("/api/v1/test/:mangaId", async (req, res) => {
  const {
    params: { mangaId },
    query: { volume = "desc", width = 256 },
  } = req;

  if (!mangaId) {
    res.json({ msg: "error" });
  }

  const response = await axios.get(`${BASE_URL}/cover`, {
    params: {
      manga: [mangaId],
      limit: 1,
      order: { volume },
      includes: ["manga"],
    },
  });

  const fileName = response.data.data[0]?.attributes?.fileName;
  if (!fileName) {
    res.json({ msg: "error" });
  }

  const coverImgUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

  // Proxy the cover image by downloading and returning it
  const imageResponse = await axios.get(coverImgUrl, {
    responseType: "stream",
  });

  // Set appropriate headers
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Access-Control-Allow-Origin", "*"); // To avoid CORS issues

  // Pipe the image data to the response
  imageResponse.data.pipe(res);

  // Cache the cover image URL for future use
});

// ... //

// every Saturday at midnight

nodeCron.schedule("0 0 * * 6", async () => {
  console.log("Sending weekly newsletter...");
  sendNewsLetter();
});

// ... //

app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await redisClient.connect();
    app.listen(PORT, () => {
      console.log(`Server listening to PORT ${PORT} ...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
