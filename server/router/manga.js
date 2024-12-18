import { Router } from "express";
import { author, cover, statics } from "../controller/manga.js";

const router = Router();

router.route("/statics/:mangaId").get(statics);
router.route("/author/:authorId").get(author);
router.route("/cover/:mangaId").get(cover);

export default router;
