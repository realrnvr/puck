import { StatusCodes } from "http-status-codes";
import Client from "../models/client.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { BadRequestError } from "../errors/badRequestError.js";

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
