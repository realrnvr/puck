import mongoose from "mongoose";

const Newsletter = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
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
      default: Date.now(),
    },
    lastSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", Newsletter);
