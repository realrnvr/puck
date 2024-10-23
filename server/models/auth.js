import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide a Username"],
    minlength: 4,
    maxlength: 8,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide a Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Pls provide a valid Email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password"],
    minlength: 8,
  },
  verificationToken: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }

  if (this.isNew || this.isModified("verificationToken")) {
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
    { username: this.username, email: this.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TIMESPAN }
  );
  return accessToken;
};

UserSchema.methods.createRefreshToken = function () {
  const refreshToken = jwt.sign(
    { username: this.username, email: this.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TIMESPAN }
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
    { expiresIn: process.env.JWT_RESET_TIMESPAN }
  );
  return resetToken;
};

export default mongoose.model("User", UserSchema);
