import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    mangaTitle: {
      type: String,
      required: [true, "please provide manga title"],
    },
    mangaId: {
      type: String,
      required: [true, "please provide manga id"],
    },
    authorId: {
      type: String,
      required: [true, "please provide author id"],
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
