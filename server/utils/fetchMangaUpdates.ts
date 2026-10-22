import { dexAxios } from "../services/dexAxios.js";
import { caseManga } from "../caseManga.js";

interface MangaFeedChapter {
  title: string | null;
  chapter: string | null;
  publishAt: string;
  pages: number;
}

interface MangaFeedResponse {
  data: Array<{
    attributes: MangaFeedChapter;
  }>;
}

export interface MangaUpdate {
  title: string | null;
  chapter: string | null;
  publishAt: string;
  pages: number;
  link: string;
}

export const fetchMangaUpdates = async (): Promise<MangaUpdate | null> => {
  try {
    const randomMangaId =
      caseManga[Math.floor(Math.random() * caseManga.length)];

    const response = await dexAxios.get<MangaFeedResponse>(
      `/manga/${randomMangaId.mangaId}/feed`,
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
      },
    );
    const mangaData = response.data.data[0];

    if (!mangaData) {
      return null;
    }

    const latestChapter = mangaData.attributes;

    const mangaUpdate: MangaUpdate = {
      title: latestChapter.title,
      chapter: latestChapter.chapter,
      publishAt: latestChapter.publishAt,
      pages: latestChapter.pages,
      link: `${process.env.CLIENT_APP_URL}/viewer/${randomMangaId.mangaId}`,
    };

    return mangaUpdate;
  } catch (error) {
    console.error("Error fetching manga data:", error);
    return null;
  }
};
