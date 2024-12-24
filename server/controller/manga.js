import { StatusCodes } from "http-status-codes";
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
    const response = await axios.get(`${BASE_URL}/cover`, {
      params: {
        manga: [mangaId],
        limit: 2,
        order: {
          volume: "desc",
        },
        includes: ["manga"],
      },
    });

    const fileName = response.data.data[0]?.attributes?.fileName;
    const coverImgUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    res.status(200).json({ coverImgUrl });
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
    const response = await axios.get(
      `${BASE_URL}/manga/${mangaId}/feed?order[volume]=asc&order[chapter]=asc`,
      {
        params: {
          translatedLanguage: ["en"],
          limit: limit || 10,
          offset: offset || 0,
          // "order[volume]": "asc",
          // "order[chapter]": "asc",
        },
      }
    );
    const { data, offset: dexOffset, limit: dexLimit, total } = response.data;

    res
      .status(StatusCodes.OK)
      .json({ data, currLen: data.length, dexLimit, dexOffset, total });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const chapterImage = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);

    const baseUrl = response.data.baseUrl;
    const hash = response.data.chapter.hash;
    const mangaImgs = response.data.chapter.data.map((val) => {
      return { src: `${baseUrl}/data/${hash}/${val}` };
    });

    res
      .status(StatusCodes.OK)
      .json({ data: mangaImgs, length: mangaImgs.length });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};
