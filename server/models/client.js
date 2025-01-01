import mongoose from "mongoose";
import { FavouriteMangaSchema } from "../schemas/FavouriteMangaSchema.js";

const ClientSchema = new mongoose.Schema(
  {
    favouriteManga: [FavouriteMangaSchema],
    client: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a valid user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
