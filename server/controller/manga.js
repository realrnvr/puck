import { StatusCodes } from "http-status-codes";
import { client } from "../config/redisClient.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { notFound } from "../middleware/notFound.js";
import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

export const statics = async (req, res) => {
  const { mangaId } = req.params;
  if (!mangaId) {
    throw new BadRequestError("Please provide params");
  }

  try {
    const response = await axios.get(`${BASE_URL}/manga/${mangaId}`);
    if (!response.data) {
      throw new notFound("Manga is not there");
    }

    res.status(StatusCodes.OK).json({ data: response.data.data });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const author = async (req, res) => {
  const { authorId } = req.params;

  if (!authorId) {
    throw new BadRequestError("Please provide author id");
  }

  try {
    const response = await axios.get(`${BASE_URL}/author/${authorId}`);

    if (!response.data) {
      throw new notFound("author is not there");
    }
    res.status(StatusCodes.OK).json({ data: response.data.data });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const cover = async (req, res) => {
  const { mangaId } = req.params;

  if (!mangaId) {
    throw new BadRequestError("provide manga Id");
  }

  try {
    const cachedCover = await client.get(`cover:${mangaId}`);
    if (cachedCover) {
      console.log("cache hit");
      return res
        .status(StatusCodes.OK)
        .json({ coverImgUrl: JSON.parse(cachedCover) });
    }

    console.log("cache miss");
    const response = await axios.get(`${BASE_URL}/cover`, {
      params: {
        manga: [mangaId],
        limit: 1,
        order: {
          volume: "desc",
        },
        includes: ["manga"],
      },
    });

    const fileName = response.data.data[0]?.attributes?.fileName;
    const coverImgUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;

    await client.setEx(`cover:${mangaId}`, 3600, JSON.stringify(coverImgUrl));

    res.status(StatusCodes.OK).json({ coverImgUrl });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const chapters = async (req, res) => {
  const {
    params: { mangaId },
    query: { limit, offset },
  } = req;

  if (!mangaId) {
    throw new BadRequestError("please provide manga id!");
  }

  try {
    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        translatedLanguage: ["en"],
        limit: limit || 10,
        offset: offset || 0,
        order: {
          volume: "asc",
          chapter: "asc",
        },
        includeExternalUrl: 0,
        includeEmptyPages: 0,
        includeFuturePublishAt: 0,
      },
    });
    const { data, offset: dexOffset, limit: dexLimit, total } = response.data;

    const chapterBound = {
      first: data[0].attributes.chapter,
      last: data[data.length - 1].attributes.chapter,
    };

    res.status(StatusCodes.OK).json({
      data: data,
      currLen: data.length,
      chapterBound,
      dexLimit,
      dexOffset,
      total,
    });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const chapterImage = async (req, res) => {
  const {
    params: { chapterId },
    query: { quality },
  } = req;

  try {
    const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    const {
      baseUrl,
      chapter: { hash, data: original, dataSaver },
    } = response.data;
    const data = quality === "data-saver" ? dataSaver : original;

    const mangaImgs = data.map((val) => {
      return { src: `${baseUrl}/${quality}/${hash}/${val}` };
    });

    res
      .status(StatusCodes.OK)
      .json({ data: mangaImgs, length: mangaImgs.length });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};
