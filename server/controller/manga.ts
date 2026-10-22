import type { Readable } from "node:stream";
import { StatusCodes } from "http-status-codes";
import mongoose, { type FilterQuery } from "mongoose";
import axios from "axios";
import type { Request, Response } from "express";
import { redisClient } from "../config/redisClient.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { setCacheHeaders } from "../helper/setCacheHeaders.js";
import { dexAxios } from "../services/dexAxios.js";
import { coverAxios } from "../services/coverAxios.js";
import Manga, { type MangaRecord } from "../models/manga.js";
import {
  assertAllowedProxyUrl,
  MAX_PROXY_BYTES,
  MAX_PROXY_REDIRECTS,
  PROXY_TIMEOUT_MS,
} from "../utils/proxyUrl.js";

const ALLOWED_PROXY_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

interface LocalizedString {
  [locale: string]: string | undefined;
}

interface MangaStaticsAttributes {
  title: LocalizedString;
  altTitles: LocalizedString[];
  description?: LocalizedString;
  publicationDemographic?: string | null;
  contentRating?: string | null;
  tags?: unknown[];
  year?: number | null;
  status?: string | null;
  links?: Record<string, string>;
  [key: string]: unknown;
}

interface MangaStatics {
  id: string;
  type: string;
  attributes: MangaStaticsAttributes;
}

interface AuthorData {
  id: string;
  type: string;
  attributes: {
    name: string;
    [key: string]: unknown;
  };
}

interface CoverResponse {
  data: Array<{
    attributes?: {
      fileName?: string;
    };
  }>;
}

interface ChapterData {
  id: string;
  type: string;
  attributes: {
    chapter?: string | null;
    [key: string]: unknown;
  };
}

interface ChapterResponse {
  data: ChapterData[];
  offset: number;
  limit: number;
  total: number;
}

interface AtHomeResponse {
  baseUrl?: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

interface MangasQuery {
  limit?: string;
  cursor?: string;
}

interface CoverQuery {
  volume?: string;
  width?: string | number;
}

interface ChaptersQuery {
  limit?: string | number;
  offset?: string | number;
}

interface ChapterImageQuery {
  quality?: string;
}

interface SearchQuery {
  query?: string;
}

interface RandomMangaQuery {
  limit?: string;
}

export const mangas = async (
  req: Request<{}, unknown, unknown, MangasQuery>,
  res: Response,
): Promise<void> => {
  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor;

  const query: FilterQuery<MangaRecord> = {};
  if (cursor) {
    query._id = { $gt: cursor as unknown as mongoose.Types.ObjectId };
  }

  const cacheKey = `mangas:${cursor || "start"}:${limit}`;
  const expiry = 3600;
  const cachedManga = await redisClient.get(cacheKey);

  if (cachedManga) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    res.status(StatusCodes.OK).json(JSON.parse(cachedManga));
    return;
  }

  const mangaData = await Manga.find(query).sort({ _id: 1 }).limit(limit);
  const lastManga = mangaData[mangaData.length - 1];
  const lastId = lastManga?._id as mongoose.Types.ObjectId | undefined;

  const hasMore = await Manga.exists({
    _id: { $gt: lastId },
  });

  const nextCursor = hasMore ? lastManga?._id : null;

  const responseData = {
    manga: mangaData,
    nextCursor,
  };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseData);
};

export const statics = async (
  req: Request<{ mangaId: string }>,
  res: Response,
): Promise<void> => {
  const { mangaId } = req.params;

  if (!mangaId) {
    throw new BadRequestError("Please provide params");
  }

  const cacheKey = `statics:${mangaId}`;
  const expiry = 3600;

  const cachedStatics = await redisClient.get(cacheKey);
  if (cachedStatics) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    res.status(StatusCodes.OK).json({ data: JSON.parse(cachedStatics) });
    return;
  }

  const response = await dexAxios.get<{ data: MangaStatics | null }>(
    `/manga/${mangaId}`,
  );
  const staticsData = response.data.data;

  if (!staticsData) {
    throw new NotFoundError("Manga not found");
  }

  const altTitles = staticsData.attributes.altTitles.map(
    (altTitle) => Object.values(altTitle)[0],
  );

  const jaTitleObj = staticsData.attributes.altTitles.find((altTitle) =>
    Object.hasOwn(altTitle, "ja"),
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

export const author = async (
  req: Request<{ authorId: string }>,
  res: Response,
): Promise<void> => {
  const { authorId } = req.params;

  if (!authorId) {
    throw new BadRequestError("Please provide author id");
  }

  const cacheKey = `author:${authorId}`;
  const expiry = 3600;

  const cachedAuthor = await redisClient.get(cacheKey);
  if (cachedAuthor) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    res.status(StatusCodes.OK).json({ data: JSON.parse(cachedAuthor) });
    return;
  }

  const response = await dexAxios.get<{ data: AuthorData | null }>(
    `/author/${authorId}`,
  );

  const authorData = response.data.data;
  if (!authorData) {
    throw new NotFoundError("Author data is not available");
  }

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(authorData));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json({ data: authorData });
};

export const cover = async (
  req: Request<{ mangaId: string }, unknown, unknown, CoverQuery>,
  res: Response,
): Promise<void> => {
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
    res.status(StatusCodes.OK).json({ coverImgUrl: proxyUrl });
    return;
  }

  const response = await dexAxios.get<CoverResponse>(`/cover`, {
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

export const proxyCover = async (
  req: Request<{ mangaId: string; fileName: string; width: string }>,
  res: Response,
): Promise<void> => {
  const {
    params: { mangaId, fileName, width },
  } = req;

  const response = await coverAxios.get<Readable>(
    `/covers/${mangaId}/${fileName}.${width}.jpg`,
    { responseType: "stream" },
  );

  // Set cache headers for browsers to cache images
  res.setHeader("Cache-Control", "public, max-age=86400, immutable");
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_APP_URL as string,
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, User-Agent",
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  response.data.pipe(res);

  response.data.on("end", () => {
    res.end();
  });
};

export const chapters = async (
  req: Request<{ mangaId: string }, unknown, unknown, ChaptersQuery>,
  res: Response,
): Promise<void> => {
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
    res.status(StatusCodes.OK).json(JSON.parse(cachedChapters));
    return;
  }

  const response = await dexAxios.get<ChapterResponse>(`/chapter`, {
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
    throw new NotFoundError("Not Found");
  }

  if (response.data.data.length == 0) {
    throw new NotFoundError("Not Found");
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

export const chapterImage = async (
  req: Request<{ chapterId: string }, unknown, unknown, ChapterImageQuery>,
  res: Response,
): Promise<void> => {
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
    res.status(StatusCodes.OK).json(JSON.parse(cachedChapterImage));
    return;
  }

  const response = await dexAxios.get<AtHomeResponse>(
    `/at-home/server/${chapterId}`,
  );

  const { baseUrl } = response.data;

  if (!baseUrl) {
    throw new NotFoundError("not found");
  }

  const {
    chapter: { hash, data: original, dataSaver },
  } = response.data;

  const data = quality === "data-saver" ? dataSaver : original;
  const mangaImgs = data.map((val) => ({
    src: `${
      process.env.API_BASE_URL
    }/api/v1/manga/proxy/chapter-image/${encodeURIComponent(
      baseUrl,
    )}/${quality}/${hash}/${val}`,
  }));

  const responseObj = { data: mangaImgs, length: mangaImgs.length };

  await redisClient.setEx(cacheKey, expiry, JSON.stringify(responseObj));
  setCacheHeaders({ res, cacheStatus: "MISS", ttl: expiry });

  res.status(StatusCodes.OK).json(responseObj);
};

export const proxyChapterImage = async (
  req: Request<{
    baseUrl: string;
    quality: string;
    hash: string;
    val: string;
  }>,
  res: Response,
): Promise<void> => {
  const { baseUrl, quality, hash, val } = req.params;

  let decodedBaseUrl;

  try {
    decodedBaseUrl = decodeURIComponent(baseUrl);
  } catch {
    throw new BadRequestError("Invalid image URL.");
  }

  if (!["data", "data-saver"].includes(quality)) {
    throw new BadRequestError("Invalid image quality.");
  }

  if (
    !/^[a-zA-Z0-9_-]+$/.test(hash) ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(val) ||
    val.includes("..")
  ) {
    throw new BadRequestError("Invalid image path.");
  }

  const base = assertAllowedProxyUrl(decodedBaseUrl);
  if (base.search || base.hash) {
    throw new BadRequestError("Invalid image base URL.");
  }

  const targetUrl = assertAllowedProxyUrl(
    `${base.origin}${base.pathname.replace(/\/+$/, "")}/${quality}/${hash}/${val}`,
  );

  const response = await axios.get<Readable>(targetUrl.toString(), {
    responseType: "stream",
    timeout: PROXY_TIMEOUT_MS,
    maxRedirects: MAX_PROXY_REDIRECTS,
    maxContentLength: MAX_PROXY_BYTES,
    maxBodyLength: MAX_PROXY_BYTES,
    beforeRedirect: (options) => {
      const redirectUrl =
        options.href ??
        `${options.protocol ?? ""}//${options.host ?? ""}${options.path ?? ""}`;
      assertAllowedProxyUrl(redirectUrl);
    },
  });

  const contentType = String(response.headers?.["content-type"] ?? "");
  const mimeType = contentType.split(";")[0].trim().toLowerCase();

  if (!ALLOWED_PROXY_IMAGE_TYPES.has(mimeType)) {
    response.data.destroy();
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: "Upstream did not return a supported image.",
    });
    return;
  }

  const contentLength = Number(response.headers?.["content-length"]);

  if (Number.isFinite(contentLength) && contentLength > MAX_PROXY_BYTES) {
    response.data.destroy();
    res.status(StatusCodes.BAD_GATEWAY).json({
      message: "Image is too large.",
    });
    return;
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=86400, immutable");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_APP_URL as string,
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, User-Agent",
  );

  if (Number.isFinite(contentLength) && contentLength >= 0) {
    res.setHeader("Content-Length", contentLength);
  }

  let receivedBytes = 0;

  response.data.on("data", (chunk: Buffer) => {
    receivedBytes += chunk.length;

    if (receivedBytes > MAX_PROXY_BYTES) {
      response.data.destroy(new Error("Image is too large."));
    }
  });

  response.data.on("error", () => {
    if (!res.headersSent) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        message: "Failed to fetch image.",
      });
      return;
    }

    res.destroy();
  });

  res.on("close", () => {
    if (!response.data.destroyed) {
      response.data.destroy();
    }
  });

  response.data.pipe(res);
};

export const search = async (
  req: Request<{}, unknown, unknown, SearchQuery>,
  res: Response,
): Promise<void> => {
  const { query } = req.query;

  if (typeof query !== "string") {
    throw new BadRequestError("Query must be a string.", "query");
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    throw new BadRequestError("Query cannot be empty.", "query");
  }

  if (trimmedQuery.length > 100) {
    throw new BadRequestError("Query cannot exceed 100 characters.", "query");
  }

  const cacheKey = `search:${trimmedQuery}`;
  const expiry = 300;

  const cachedSearch = await redisClient.get(cacheKey);
  if (cachedSearch) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    res.status(StatusCodes.OK).json(JSON.parse(cachedSearch));
    return;
  }

  const manga = await Manga.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: trimmedQuery,
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

export const randomManga = async (
  req: Request<{}, unknown, unknown, RandomMangaQuery>,
  res: Response,
): Promise<void> => {
  const limit = Number.parseInt(req.query.limit ?? "", 10) || 6;

  const cacheKey = `randomManga:${limit}`;
  const expiry = 300;

  const cachedRandomManga = await redisClient.get(cacheKey);
  if (cachedRandomManga) {
    setCacheHeaders({ res, cacheStatus: "HIT", ttl: expiry });
    res.status(StatusCodes.OK).json(JSON.parse(cachedRandomManga));
    return;
  }

  const manga = await Manga.aggregate([
    { $sample: { size: limit } },
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
