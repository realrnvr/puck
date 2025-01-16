import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minlength: 4,
    maxlength: 50,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    validate: {
      validator: function (value) {
        return !value || value.length >= 8;
      },
      message: "Password must be at least 8 characters long.",
    },
  },
  type: {
    type: String,
    enum: ["normal", "google", "both"],
    default: "normal",
  },
  googleId: {
    type: String, // Removed `unique: true` here
  },
  verificationToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.googleId) {
    this.isVerified = true;
  }

  if (this.isModified("password")) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }

  // Only set verification token if user is new
  if (this.isNew) {
    this.verificationToken = this.createVerificationToken();
  }

  next();
});

UserSchema.methods.verifyPassword = async function (stringPassword) {
  const isMatch = await bcryptjs.compare(stringPassword, this.password);
  return isMatch;
};

UserSchema.methods.createAccessToken = function () {
  const accessToken = jwt.sign(
    { username: this.username, userId: this._id, email: this.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TIMESPAN }
  );
  return accessToken;
};

UserSchema.methods.createRefreshToken = function () {
  const refreshToken = jwt.sign(
    { username: this.username, userId: this._id, email: this.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: Number(process.env.JWT_REFRESH_TIMESPAN) }
  );
  return refreshToken;
};

UserSchema.methods.createVerificationToken = function () {
  const verificationToken = jwt.sign(
    { email: this.email },
    process.env.JWT_VERIFICATION_SECRET,
    { expiresIn: process.env.JWT_VERIFICATION_TIMESPAN }
  );
  return verificationToken;
};

UserSchema.methods.createResetToken = function () {
  const resetToken = jwt.sign(
    { email: this.email },
    process.env.JWT_RESET_SECRET,
    { expiresIn: "7d" }
  );
  return resetToken;
};

export default mongoose.model("User", UserSchema);
