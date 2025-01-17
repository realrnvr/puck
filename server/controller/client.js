import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/notFoundError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import Client from "../models/client.js";
import User from "../models/auth.js";

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

  const client = await Client.find({ createdBy: userId }).sort("desc");
  res.status(StatusCodes.OK).json({
    client,
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
    { new: true, runValidators: true }
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
      "new password must be equal to confirm new password"
    );
  }

  const user = await User.findOne({ _id: userId });
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
  await user.save();

  res.status(StatusCodes.OK).json({ message: "password changed!" });
};
