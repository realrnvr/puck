import { config } from "dotenv";
config();

import express from "express";
const app = express();

import cors from "cors";
import "express-async-errors";

import { connectDB } from "./connectDB/connectDB.js";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";
import { auth } from "./middleware/authorization.js";
import { notFound } from "./middleware/notFound.js";
import { StatusCodes } from "http-status-codes";
import authRouter from "./router/auth.js";
import cookieParser from "cookie-parser";

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
app.get("/api/v1/users", auth, (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Yahoo you made it!" });
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
