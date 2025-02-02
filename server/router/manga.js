import { Router } from "express";
import {
  author,
  chapterImage,
  chapters,
  cover,
  mangas,
  proxyChapterImage,
  proxyCover,
  randomManga,
  search,
  statics,
} from "../controller/manga.js";

const router = Router();

router.route("/search").get(search);
router.route("/mangas").get(mangas);
router.route("/statics/:mangaId").get(statics);
router.route("/author/:authorId").get(author);
router.route("/cover/:mangaId").get(cover);
router.route("/chapters/:mangaId").get(chapters);
router.route("/chapter-image/:chapterId").get(chapterImage);
router.route("/random-manga").get(randomManga);

// ${process.env.API_BASE_URL}/api/proxy/cover/${mangaId}/${fileName}.${width}.jpg
router.route("/proxy/cover/:mangaId/:fileName/:width").get(proxyCover);
// ${process.env.API_BASE_URL}/api/v1/manga/proxy/chapter-image/${encodeURIComponent(baseUrl)}/${quality}/${hash}/${val}
router
  .route("/proxy/chapter-image/:baseUrl/:quality/:hash/:val")
  .get(proxyChapterImage);

export default router;
