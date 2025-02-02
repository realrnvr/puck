import { dexAxios } from "../services/dexAxios.js";
import { caseManga } from "../caseManga.js";

export const fetchMangaUpdates = async () => {
  try {
    const randomMangaId =
      caseManga[Math.floor(Math.random() * caseManga.length)];

    const response = await dexAxios.get(
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
      }
    );
    const mangaData = response.data.data[0];

    const latestChapter = mangaData.attributes;

    const mangaUpdate = {
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
