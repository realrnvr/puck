/**
 * Copyright 2025 realrnvr
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
