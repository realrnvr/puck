import mongoose, { type HydratedDocument, type Model } from "mongoose";

export interface MangaRecord {
  title: string;
  mangaId: string;
  authorId: string;
  description?: string;
}

export type MangaDocument = HydratedDocument<MangaRecord>;

const MangaSchema = new mongoose.Schema<MangaRecord>({
  title: { type: String, required: [true, "please provide manga title"] },
  mangaId: {
    type: String,
    required: [true, "please provide manga id"],
    unique: true,
  },
  authorId: { type: String, required: [true, "please provide author id"] },
  description: { type: String },
});

const Manga: Model<MangaRecord> = mongoose.model<MangaRecord>(
  "Manga",
  MangaSchema,
);

export default Manga;
