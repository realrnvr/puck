import { StatusCodes } from "http-status-codes";
import { redisClient } from "../config/redisClient.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { setCacheHeaders } from "../helper/setCacheHeaders.js";
import Manga from "../models/manga.js";
import axios from "axios";

const BASE_URL = "https://api.mangadex.org";

export const mangas = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor;

  let query = {};
  if (cursor) {
    query._id = { $gt: cursor };
  }

  const cacheKey = `mangas:${cursor || "start"}:${limit}`;
  const expiry = 3600;
  const cachedManga = await redisClient.get(cacheKey);

  if (cachedManga) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    return res.status(StatusCodes.OK).json(JSON.parse(cachedManga));
  }

  const mangaData = await Manga.find(query).sort({ _id: 1 }).limit(limit);

  const hasMore = await Manga.exists({
    _id: { $gt: mangaData[mangaData.length - 1]?._id },
  });

  const nextCursor = hasMore ? mangaData[mangaData.length - 1]?._id : null;

  const responseData = {
    manga: mangaData,
    nextCursor,
  };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseData);
};

export const statics = async (req, res) => {
  const { mangaId } = req.params;

  if (!mangaId) {
    throw new BadRequestError("Please provide params");
  }

  const cacheKey = `statics:${mangaId}`;
  const expiry = 3600;

  const cachedStatics = await redisClient.get(cacheKey);
  if (cachedStatics) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
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

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(safeData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json({ data: safeData });
};

export const author = async (req, res) => {
  const { authorId } = req.params;

  if (!authorId) {
    throw new BadRequestError("Please provide author id");
  }

  const cacheKey = `author:${authorId}`;
  const expiry = 3600;

  const cachedAuthor = await redisClient.get(cacheKey);
  if (cachedAuthor) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    return res.status(StatusCodes.OK).json({ data: JSON.parse(cachedAuthor) });
  }

  const response = await axios.get(`${BASE_URL}/author/${authorId}`);

  const authorData = response.data.data;
  if (!authorData) {
    throw new NotFoundError("Author data is not available");
  }

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(authorData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json({ data: authorData });
};

export const cover = async (req, res) => {
  const {
    params: { mangaId },
    query: { volume = "desc", width = 256 },
  } = req;

  if (!mangaId) {
    throw new BadRequestError("Provide manga Id");
  }

  const cacheKey = `cover:${mangaId}:${volume}:${width}`;
  const expiry = 3600;

  const cachedCover = await redisClient.get(cacheKey);
  if (cachedCover) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    const proxyUrl = `${process.env.API_BASE_URL}/api/v1/manga/proxy/cover/${mangaId}/${cachedCover}/${width}`;
    return res.status(StatusCodes.OK).json({ coverImgUrl: proxyUrl });
  }

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

  await redisClient.setEx(cacheKey, expiry, fileName);
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  const proxyUrl = `${process.env.API_BASE_URL}/api/v1/manga/proxy/cover/${mangaId}/${fileName}/${width}`;
  res.status(StatusCodes.OK).json({ coverImgUrl: proxyUrl });
};

export const proxyCover = async (req, res) => {
  const {
    params: { mangaId, fileName, width },
  } = req;

  const response = await axios.get(
    `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${width}.jpg`,
    {
      responseType: "stream",
    }
  );

  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");

  response.data.pipe(res);
};

export const chapters = async (req, res) => {
  const {
    params: { mangaId },
    query: { limit = 10, offset = 0 },
  } = req;

  if (!mangaId) {
    throw new BadRequestError("please provide manga id!");
  }

  const cacheKey = `chapters:${mangaId}:${limit}:${offset}`;
  const expiry = 3600;

  const cachedChapters = await redisClient.get(cacheKey);
  if (cachedChapters) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
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

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseObj));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseObj);
};

export const chapterImage = async (req, res) => {
  const {
    params: { chapterId },
    query: { quality = "data" },
  } = req;

  if (!chapterId) {
    throw new BadRequestError("please provide a valid chapter id");
  }

  const cacheKey = `chapterImage:${chapterId}:${quality}`;
  const expiry = 600;

  const cachedChapterImage = await redisClient.get(cacheKey);
  if (cachedChapterImage) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
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
    return {
      src: `${
        process.env.API_BASE_URL
      }/api/v1/manga/proxy/chapter-image/${encodeURIComponent(
        baseUrl
      )}/${quality}/${hash}/${val}`,
    };
  });

  const responseObj = { data: mangaImgs, length: mangaImgs.length };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseObj));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseObj);
};

export const proxyChapterImage = async (req, res) => {
  let { baseUrl, quality, hash, val } = req.params;

  baseUrl = decodeURIComponent(baseUrl);

  const response = await axios.get(`${baseUrl}/${quality}/${hash}/${val}`, {
    responseType: "stream",
  });
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");

  response.data.pipe(res);
};

export const search = async (req, res) => {
  const { query } = req.query;

  const cacheKey = `search:${query}`;
  const expiry = 300;

  const cachedSearch = await redisClient.get(cacheKey);
  if (cachedSearch) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    return res.status(StatusCodes.OK).json(JSON.parse(cachedSearch));
  }

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
            prefixLength: 0,
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

  const responseData = {
    manga,
  };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(200).json(responseData);
};

export const randomManga = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;

  const cacheKey = `randomManga:${limit}`;
  const expiry = 300;

  const cachedRandomManga = await redisClient.get(cacheKey);
  if (cachedRandomManga) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    return res.status(StatusCodes.OK).json(JSON.parse(cachedRandomManga));
  }

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

  const responseData = {
    manga,
    length: manga.length,
  };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseData);
};
