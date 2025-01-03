import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    mangaTitle: {
      type: String,
    },
    mangaId: {
      type: String,
    },
    authorId: {
      type: String,
    },
    coverUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a valid user"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", ClientSchema);
