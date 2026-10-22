export interface MangaData {
  mangaTitle?: string;
  mangaId: string;
  authorId: string;
  coverUrl?: string;
}

export interface MangaState {
  chapterCount: number;
  quality: string;
  offset: number;
}
