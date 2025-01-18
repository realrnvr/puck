import mongoose from "mongoose";

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mangaId: { type: String, unique: true },
  authorId: { type: String },
  description: { type: String },
});

export default mongoose.model("Manga", MangaSchema);
