import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/notFoundError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import Client from "../models/client.js";
import User from "../models/auth.js";
import { clearRefreshTokenCookie } from "../helper/setRefreshTokenCookie.js";

export const favourite = async (req, res) => {
  const {
    user: { userId },
    params: { mangaId },
  } = req;

  const isFavourite = await Client.exists({ createdBy: userId, mangaId });
  res.status(StatusCodes.OK).json({ isFavourite: Boolean(isFavourite) });
};

export const Allfavourites = async (req, res) => {
  const { userId } = req.user;
  const rawLimit = req.query.limit;
  const cursor = req.query.cursor;

  if (rawLimit !== undefined && typeof rawLimit !== "string") {
    throw new BadRequestError(
      "Limit must be an integer between 1 and 50.",
      "limit",
    );
  }

  const limit = rawLimit === undefined ? 8 : Number(rawLimit);

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new BadRequestError(
      "Limit must be an integer between 1 and 50.",
      "limit",
    );
  }

  if (
    cursor !== undefined &&
    (typeof cursor !== "string" || !mongoose.isValidObjectId(cursor))
  ) {
    throw new BadRequestError("Invalid cursor.", "cursor");
  }

  const query = { createdBy: userId };
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const favourites = await Client.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = favourites.length > limit;
  const client = hasMore ? favourites.slice(0, limit) : favourites;
  const nextCursor = hasMore ? client[client.length - 1]._id : null;

  res.status(StatusCodes.OK).json({
    client,
    nextCursor,
    length: client.length,
  });
};

export const addFavourite = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const client = await Client.create({ ...req.body });
  res.status(StatusCodes.OK).json({ client, message: "Added!" });
};

export const removeFavourite = async (req, res) => {
  const {
    user: { userId },
    params: { mangaId },
  } = req;

  const client = await Client.findOneAndDelete({
    mangaId,
    createdBy: userId,
  });

  res.status(StatusCodes.OK).json({ client, message: "Removed" });
};

export const user = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    throw new BadRequestError("Please provide user id");
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res
    .status(StatusCodes.OK)
    .json({ username: user.username, email: user.email, type: user.type });
};

export const updateUsername = async (req, res) => {
  const {
    user: { userId },
    body: { newUsername },
  } = req;

  if (!newUsername) {
    throw new BadRequestError("Please provide new username.");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, username: { $ne: newUsername } },
    { username: newUsername },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new BadRequestError("The username is already the same.");
  }

  res.status(StatusCodes.OK).json({ username: user.username });
};

export const updatePassword = async (req, res) => {
  const {
    user: { userId },
    body: { oldPassword, newPassword, confirmNewPassword },
  } = req;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new BadRequestError("Please provide required fields");
  }

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError(
      "new password must be equal to confirm new password",
    );
  }

  const user = await User.findOne({ _id: userId }).select("+password");
  if (!user) {
    throw new NotFoundError("user does not exists");
  }

  if (user.type === "google") {
    throw new BadRequestError("Please create a password to change it");
  }

  const isCorrect = await user.verifyPassword(oldPassword);
  if (!isCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Old password is incorrect", type: "oldPassword" });
  }

  user.password = newPassword;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();
  clearRefreshTokenCookie(res);

  res.status(StatusCodes.OK).json({ message: "password changed!" });
};
