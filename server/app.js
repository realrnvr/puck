import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import "express-async-errors";
import nodeCron from "node-cron";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";
import { notFound } from "./middleware/notFound.js";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "./connectDB/connectDB.js";
import { auth } from "./middleware/authorization.js";
import { redisClient } from "./config/redisClient.js";

import authRouter from "./router/auth.js";
import mangaRouter from "./router/manga.js";
import clientRouter from "./router/client.js";
import newsletterRouter from "./router/newsletter.js";
import cookieParser from "cookie-parser";
import Client from "./models/client.js";
import { sendNewsLetter } from "./services/newsletter.js";

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4173",
    ],
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
app.use("/api/v1/client", auth, clientRouter);
app.use("/api/v1/newsletter", newsletterRouter);

// test route

app.get("/api/v1/users", auth, async (req, res) => {
  const client = await Client.findOne({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ msg: "Yahoo you made it!" });
});

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
