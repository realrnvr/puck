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

app.set("trust proxy", 1);
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

// every Saturday at midnight

nodeCron.schedule("0 0 * * 6", () => {
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
