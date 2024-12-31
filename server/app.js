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
import { client } from "./config/redisClient.js";

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

// test route

app.get("/api/v1/users", auth, (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Yahoo you made it!" });
});

app.get("/api/v1/test", async (req, res) => {
  try {
    await client.set("foo", "bar");
    const result = await client.get("foo");
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

// ... //

app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await client.connect();
    app.listen(PORT, () => {
      console.log(`Server listening to PORT ${PORT} ...`);
    });
  } catch (error) {
    console.log(error);
  }
})();
