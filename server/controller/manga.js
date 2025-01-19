import { StatusCodes } from "http-status-codes";
import { redisClient } from "../config/redisClient.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import Manga from "../models/manga.js";
import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

export const mangas = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor;

  let query = {};
  if (cursor) {
    query = { _id: { $gt: cursor } };
  }

  const cacheKey = `mangas:${cursor || "start"}:${limit}`;
  const cachedManga = await redisClient.get(cacheKey);
  if (cachedManga) {
    console.log("Manga cache hit");
    return res.status(StatusCodes.OK).json(JSON.parse(cachedManga));
  }

  const mangaData = await Manga.find(query).sort({ _id: 1 }).limit(limit);

  const nextCursor =
    mangaData.length === limit ? mangaData[mangaData.length - 1]._id : null;

  const responseData = {
    manga: mangaData,
    nextCursor,
  };

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

  res.status(StatusCodes.OK).json(responseData);
};

export const statics = async (req, res) => {
  const { mangaId } = req.params;

  if (!mangaId) {
    throw new BadRequestError("Please provide params");
  }

  const cacheKey = `statics:${mangaId}`;

  const cachedStatics = await redisClient.get(cacheKey);
  if (cachedStatics) {
    console.log("statics cache value");
    return res.status(StatusCodes.OK).json({ data: JSON.parse(cachedStatics) });
  }

  const response = await axios.get(`${BASE_URL}/manga/${mangaId}`);
  const staticsData = response.data.data;

  if (!staticsData) {
    throw new NotFoundError("Manga not found");
  }

  const altTitles = staticsData.attributes.altTitles.map(
    (altTitle) => Object.values(altTitle)[0]
  );

  const jaTitleObj = staticsData.attributes.altTitles.find((altTitle) =>
    altTitle.hasOwnProperty("ja")
  );
  const jaTitle = jaTitleObj ? jaTitleObj.ja : "No Japanese title available";

  const safeData = {
    ...staticsData,
    attributes: {
      ...staticsData.attributes,
      title: staticsData.attributes.title || { en: "No Title Available" },
      altTitles: altTitles,
      publicationDemographic:
        staticsData.attributes.publicationDemographic || "Unknown",
      contentRating: staticsData.attributes.contentRating || "Not Rated",
      tags: staticsData.attributes.tags || [],
      year: staticsData.attributes.year || "Unknown",
      status: staticsData.attributes.status || "Unknown",
      description: {
        en:
          staticsData.attributes.description?.en || "No description available",
      },
      links: staticsData.attributes.links || {},
      altTitleJa: jaTitle,
    },
  };

  console.log("statics response value");
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(safeData));

  res.status(StatusCodes.OK).json({ data: safeData });
};

export const author = async (req, res) => {
  const { authorId } = req.params;

  if (!authorId) {
    throw new BadRequestError("Please provide author id");
  }

  try {
    const cacheKey = `author:${authorId}`;

    const cachedAuthor = await redisClient.get(cacheKey);
    if (cachedAuthor) {
      console.log("author cache value");
      return res
        .status(StatusCodes.OK)
        .json({ data: JSON.parse(cachedAuthor) });
    }

    const response = await axios.get(`${BASE_URL}/author/${authorId}`);

    const authorData = response.data.data;
    if (!authorData) {
      throw new NotFoundError("Author data is not available");
    }

    console.log("author response value");

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(authorData));

    res.status(StatusCodes.OK).json({ data: authorData });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const cover = async (req, res) => {
  const {
    params: { mangaId },
    query: { volume = "desc" },
  } = req;

  if (!mangaId) {
    throw new BadRequestError("provide manga Id");
  }

  try {
    const cacheKey = `cover:${mangaId}:${volume}`;

    const cachedCover = await redisClient.get(cacheKey);
    if (cachedCover) {
      console.log("cover cache hit");
      return res
        .status(StatusCodes.OK)
        .json({ coverImgUrl: JSON.parse(cachedCover) });
    }

    console.log("cover cache miss");
    const response = await axios.get(`${BASE_URL}/cover`, {
      params: {
        manga: [mangaId],
        limit: 1,
        order: {
          volume: volume,
        },
        includes: ["manga"],
      },
    });

    const fileName = response.data.data[0]?.attributes?.fileName;
    if (!fileName) {
      throw new NotFoundError("Cover not found");
    }

    const coverImgUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(coverImgUrl));

    res.status(StatusCodes.OK).json({ coverImgUrl });
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const chapters = async (req, res) => {
  const {
    params: { mangaId },
    query: { limit = 10, offset = 0 },
  } = req;

  if (!mangaId) {
    throw new BadRequestError("please provide manga id!");
  }

  try {
    const cacheKey = `chapters:${mangaId}:${limit}:${offset}`;

    const cachedChapters = await redisClient.get(cacheKey);
    if (cachedChapters) {
      console.log("chapter cache value");
      return res.status(StatusCodes.OK).json(JSON.parse(cachedChapters));
    }

    const response = await axios.get(`${BASE_URL}/chapter`, {
      params: {
        manga: mangaId,
        translatedLanguage: ["en"],
        limit: limit,
        offset: offset,
        order: {
          volume: "asc",
          chapter: "asc",
        },
        includeExternalUrl: 0,
        includeEmptyPages: 0,
        includeFuturePublishAt: 0,
      },
    });

    if (!response.data.data) {
      throw new NotFoundError("not found");
    }

    const { data, offset: dexOffset, limit: dexLimit, total } = response.data;

    const chapterBound = {
      first: data[0].attributes.chapter,
      last: data[data.length - 1].attributes.chapter,
    };

    const responseObj = {
      data: data,
      currLen: data.length,
      chapterBound,
      dexLimit,
      dexOffset,
      total,
    };

    console.log("chapters response value");
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseObj));

    res.status(StatusCodes.OK).json(responseObj);
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const chapterImage = async (req, res) => {
  const {
    params: { chapterId },
    query: { quality = "data" },
  } = req;

  if (!chapterId) {
    throw new BadRequestError("please provide a valid chapter id");
  }

  try {
    const cacheKey = `chapterImage:${chapterId}:${quality}`;

    const cachedChapterImage = await redisClient.get(cacheKey);
    if (cachedChapterImage) {
      console.log("chapterImage cache value");
      return res.status(StatusCodes.OK).json(JSON.parse(cachedChapterImage));
    }

    const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!response.data.baseUrl) {
      throw new NotFoundError("not found");
    }

    const {
      baseUrl,
      chapter: { hash, data: original, dataSaver },
    } = response.data;

    const data = quality === "data-saver" ? dataSaver : original;
    const mangaImgs = data.map((val) => {
      return { src: `${baseUrl}/${quality}/${hash}/${val}` };
    });

    const responseObj = { data: mangaImgs, length: mangaImgs.length };

    console.log("chapterImage response value");
    await redisClient.setEx(cacheKey, 600, JSON.stringify(responseObj));

    res.status(StatusCodes.OK).json(responseObj);
  } catch (error) {
    throw new BadRequestError("something went wrong");
  }
};

export const search = async (req, res) => {
  const { query } = req.query;

  const manga = await Manga.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: query,
          path: "title",
          tokenOrder: "sequential",
          fuzzy: {
            maxEdits: 1,
            prefixLength: 2,
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        mangaId: 1,
        authorId: 1,
        description: 1,
        highlights: { $meta: "searchHighlights" },
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({ manga });
};

export const randomManga = async (req, res) => {
  const { limit = 6 } = req.query;

  const manga = await Manga.aggregate([
    { $sample: { size: parseInt(limit) } },
    {
      $project: {
        title: 1,
        mangaId: 1,
        authorId: 1,
        description: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({ manga, length: manga.length });
};
