import { Router } from "express";
import {
  author,
  chapterImage,
  chapters,
  cover,
  mangas,
  randomManga,
  search,
  statics,
} from "../controller/manga.js";

const router = Router();

router.route("/mangas").get(mangas);
router.route("/statics/:mangaId").get(statics);
router.route("/author/:authorId").get(author);
router.route("/cover/:mangaId").get(cover);
router.route("/chapters/:mangaId").get(chapters);
router.route("/chapter-image/:chapterId").get(chapterImage);
router.route("/search").get(search);
router.route("/random-manga").get(randomManga);

export default router;
