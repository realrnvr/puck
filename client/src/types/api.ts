export interface MangaRecord {
  _id?: string;
  title: string;
  mangaId: string;
  authorId: string;
  description?: string;
}

export interface MangasPage {
  manga: MangaRecord[];
  nextCursor: string | null;
}

export interface FavouriteManga {
  _id?: string;
  mangaTitle: string;
  mangaId: string;
  authorId: string;
  createdBy?: string;
}

export interface FavouritesPage {
  client: FavouriteManga[];
  nextCursor: string | null;
  length: number;
}

export interface MangaCoverResponse {
  coverImgUrl: string;
}

export interface FavouriteStatusResponse {
  isFavourite: boolean;
}

export interface RandomMangaResponse {
  manga: MangaRecord[];
  length: number;
}

export interface SearchManga extends MangaRecord {
  highlights?: unknown[];
  score?: number;
}

export interface SearchResponse {
  manga: SearchManga[];
}

export interface LocalizedText {
  en?: string;
  [locale: string]: string | undefined;
}

export interface AniListMangaAttributes {
  title?: LocalizedText;
  altTitles?: Array<Record<string, string>>;
  description?: LocalizedText;
  publicationDemographic?: string | null;
  contentRating?: string | null;
  tags?: unknown[];
  year?: number | string | null;
  status?: string | null;
  links?: Record<string, string>;
  altTitleJa?: string;
}

export interface AniListManga {
  id: string;
  attributes: AniListMangaAttributes;
}

export interface AniListAuthorAttributes {
  name?: string;
  biography?: LocalizedText;
}

export interface AniListAuthor {
  id: string;
  attributes: AniListAuthorAttributes;
}

export interface StaticsResponse {
  data: AniListManga;
}

export interface AuthorResponse {
  data: AniListAuthor;
}

export interface ChapterAttributes {
  chapter?: string;
  volume?: string;
  title?: string;
  translatedLanguage?: string;
}

export interface Chapter {
  id: string;
  attributes: ChapterAttributes;
}

export interface ChaptersResponse {
  data: Chapter[];
  currLen: number;
  chapterBound: {
    first?: string;
    last?: string;
  };
  dexLimit: number;
  dexOffset: number;
  total: number;
}

export interface ChapterImage {
  src: string;
}

export interface ChapterImagesResponse {
  data: ChapterImage[];
  length: number;
}
