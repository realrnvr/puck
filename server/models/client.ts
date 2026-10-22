import mongoose, { type HydratedDocument, type Model } from "mongoose";

export interface ClientRecord {
  mangaTitle: string;
  mangaId: string;
  authorId: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ClientDocument = HydratedDocument<ClientRecord>;

const ClientSchema = new mongoose.Schema<ClientRecord>(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a valid user"],
    },
  },
  { timestamps: true },
);

const Client: Model<ClientRecord> = mongoose.model<ClientRecord>(
  "Client",
  ClientSchema,
);

export default Client;
