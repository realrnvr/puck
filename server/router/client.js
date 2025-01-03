import { Router } from "express";
import {
  addFavourite,
  Allfavourites,
  favourite,
  removeFavourite,
} from "../controller/client.js";

const router = Router();

router.route("/favourite/:mangaId").get(favourite);
router.route("/all-favourites").get(Allfavourites);
router.route("/add-favourite").post(addFavourite);
router.route("/remove-favourite/:mangaId").delete(removeFavourite);

export default router;
