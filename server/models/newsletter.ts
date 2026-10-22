import mongoose, { type HydratedDocument, type Model } from "mongoose";

export interface NewsletterRecord {
  email: string;
  isSubscribed?: boolean;
  subscriptionDate?: Date;
  lastSent?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NewsletterDocument = HydratedDocument<NewsletterRecord>;

const NewsletterSchema = new mongoose.Schema<NewsletterRecord>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "please provide valid email",
      },
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionDate: {
      type: Date,
      default: Date.now,
    },
    lastSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Newsletter: Model<NewsletterRecord> = mongoose.model<NewsletterRecord>(
  "Newsletter",
  NewsletterSchema,
);

export default Newsletter;
