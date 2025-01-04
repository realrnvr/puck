import axios from "axios";
import { mangaIds } from "./mangaIds.js";

export const fetchMangaUpdates = async () => {
  try {
    const randomMangaId = mangaIds[Math.floor(Math.random() * mangaIds.length)];

    const response = await axios.get(
      `https://api.mangadex.org/manga/${randomMangaId.mangaId}/feed`,
      {
        params: {
          translatedLanguage: ["en"],
          limit: 1,
          offset: 0,
          order: {
            volume: "desc",
            chapter: "desc",
          },
          includeExternalUrl: 0,
          includeEmptyPages: 0,
          includeFuturePublishAt: 0,
        },
      }
    );
    const mangaData = response.data.data[0];

    const latestChapter = mangaData.attributes;

    const mangaUpdate = {
      title: latestChapter.title,
      chapter: latestChapter.chapter,
      publishAt: latestChapter.publishAt,
      pages: latestChapter.pages,
      link: `http://localhost:5173/viewer/${randomMangaId.mangaId}`,
    };

    return mangaUpdate;
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return null;
  }
};
