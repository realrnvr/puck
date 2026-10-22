import { Router } from "express";
import { addSubscriber, removeSubscriber } from "../controller/newsletter.js";

const router = Router();

router.route("/add-subscriber").post(addSubscriber);
router.route("/remove-subscriber/:email").delete(removeSubscriber);

export default router;
