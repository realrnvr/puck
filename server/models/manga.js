import mongoose from "mongoose";

const MangaSchema = new mongoose.Schema({
  title: { type: String, required: [true, "please provide manga title"] },
  mangaId: {
    type: String,
    required: [true, "please provide manga id"],
    unique: true,
  },
  authorId: { type: String, required: [true, "please provide author id"] },
  description: { type: String },
});

export default mongoose.model("Manga", MangaSchema);
