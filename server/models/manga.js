import mongoose from "mongoose";

const MangaSchema = new mongoose.Schema({
  img: { type: String },
  title: { type: String },
  mangaId: { type: String, unique: true },
  authorId: { type: String },
});

export default mongoose.model("Manga", MangaSchema);
