import { Router } from "express";
import {
  addFavourite,
  Allfavourites,
  favourite,
  removeFavourite,
  updatePassword,
  updateUsername,
  user,
} from "../controller/client.js";

const router = Router();

router.route("/favourite/:mangaId").get(favourite);
router.route("/all-favourites").get(Allfavourites);
router.route("/add-favourite").post(addFavourite);
router.route("/remove-favourite/:mangaId").delete(removeFavourite);
router.route("/user").get(user);
router.route("/update-username").patch(updateUsername);
router.route("/update-password").patch(updatePassword);

export default router;
