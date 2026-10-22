import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { NotFoundError } from "../errors/notFoundError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import Client, { type ClientRecord } from "../models/client.js";
import User from "../models/auth.js";
import { clearRefreshTokenCookie } from "../helper/setRefreshTokenCookie.js";
import { requireAuthUser, type AuthRequest } from "../types/auth.js";

interface FavouriteParams {
  mangaId: string;
}

interface AddFavouriteBody {
  mangaTitle: string;
  mangaId: string;
  authorId: string;
  createdBy?: string;
}

interface UpdateUsernameBody {
  newUsername?: string;
}

interface UpdatePasswordBody {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export const favourite = async (
  req: AuthRequest<FavouriteParams>,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
  const { mangaId } = req.params;

  const isFavourite = await Client.exists({
    createdBy: new mongoose.Types.ObjectId(userId),
    mangaId,
  });
  res.status(StatusCodes.OK).json({ isFavourite: Boolean(isFavourite) });
};

export const allFavourites = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
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

  const query: mongoose.FilterQuery<ClientRecord> = {
    createdBy: new mongoose.Types.ObjectId(userId),
  };
  if (cursor) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
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

export const addFavourite = async (
  req: AuthRequest<Request["params"], unknown, AddFavouriteBody>,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
  const client = await Client.create({
    ...req.body,
    createdBy: new mongoose.Types.ObjectId(userId),
  });
  res.status(StatusCodes.OK).json({ client, message: "Added!" });
};

export const removeFavourite = async (
  req: AuthRequest<FavouriteParams>,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
  const { mangaId } = req.params;

  const client = await Client.findOneAndDelete({
    mangaId,
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  res.status(StatusCodes.OK).json({ client, message: "Removed" });
};

export const user = async (req: AuthRequest, res: Response): Promise<void> => {
  const { userId } = requireAuthUser(req);
  if (!userId) {
    throw new BadRequestError("Please provide user id");
  }

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res
    .status(StatusCodes.OK)
    .json({ username: user.username, email: user.email, type: user.type });
};

export const updateUsername = async (
  req: AuthRequest<Request["params"], unknown, UpdateUsernameBody>,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
  const { newUsername } = req.body;

  if (!newUsername) {
    throw new BadRequestError("Please provide new username.");
  }

  const user = await User.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(userId),
      username: { $ne: newUsername },
    },
    { username: newUsername },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new BadRequestError("The username is already the same.");
  }

  res.status(StatusCodes.OK).json({ username: user.username });
};

export const updatePassword = async (
  req: AuthRequest<Request["params"], unknown, UpdatePasswordBody>,
  res: Response,
): Promise<void> => {
  const { userId } = requireAuthUser(req);
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new BadRequestError("Please provide required fields");
  }

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError(
      "new password must be equal to confirm new password",
    );
  }

  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  }).select("+password");
  if (!user) {
    throw new NotFoundError("user does not exists");
  }

  if (user.type === "google") {
    throw new BadRequestError("Please create a password to change it");
  }

  const isCorrect = await user.verifyPassword(oldPassword);
  if (!isCorrect) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Old password is incorrect", type: "oldPassword" });
    return;
  }

  user.password = newPassword;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();
  clearRefreshTokenCookie(res);

  res.status(StatusCodes.OK).json({ message: "password changed!" });
};
