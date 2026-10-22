import mongoose, { type HydratedDocument, type Model } from "mongoose";
import jwt, { type SignOptions } from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export interface UserRecord {
  username: string;
  email: string;
  password?: string;
  type: "normal" | "google" | "both";
  googleId?: string;
  verificationToken?: string;
  resetToken?: string;
  refreshToken?: string;
  tokenVersion: number;
  isVerified: boolean;
}

export interface UserMethods {
  verifyPassword(stringPassword: string): Promise<boolean>;
  createAccessToken(): string;
  createRefreshToken(): string;
  createVerificationToken(): string;
  createResetToken(): string;
}

export type UserDocument = HydratedDocument<UserRecord, UserMethods>;
export type UserModel = Model<UserRecord, {}, UserMethods>;

const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const UserSchema = new mongoose.Schema<UserRecord, UserModel, UserMethods>({
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
    trim: true,
  },
  password: {
    type: String,
    required: function (this: UserRecord) {
      return !this.googleId;
    },
    select: false,
    validate: {
      validator: function (value: string | undefined) {
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
    type: String,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  resetToken: {
    type: String,
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre(
  "save",
  async function (
    this: UserDocument,
    next: mongoose.CallbackWithoutResultAndOptionalError,
  ) {
    if (this.googleId) {
      this.isVerified = true;
    }

    if (this.isModified("password") && this.password) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }

    // Only set verification token if user is new
    if (this.isNew) {
      this.verificationToken = this.createVerificationToken();
    }

    next();
  },
);

UserSchema.methods.verifyPassword = async function (
  this: UserDocument,
  stringPassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  const isMatch = await bcryptjs.compare(stringPassword, this.password);
  return isMatch;
};

UserSchema.methods.createAccessToken = function (this: UserDocument): string {
  const accessToken = jwt.sign(
    {
      userId: this._id,
      email: this.email,
      tokenVersion: this.tokenVersion ?? 0,
    },
    requireEnv("JWT_ACCESS_SECRET"),
    {
      expiresIn: process.env.JWT_ACCESS_TIMESPAN as SignOptions["expiresIn"],
    },
  );
  return accessToken;
};

UserSchema.methods.createRefreshToken = function (this: UserDocument): string {
  const refreshToken = jwt.sign(
    {
      userId: this._id,
      email: this.email,
      tokenVersion: this.tokenVersion ?? 0,
    },
    requireEnv("JWT_REFRESH_SECRET"),
    { expiresIn: Number(process.env.JWT_REFRESH_TIMESPAN) },
  );
  return refreshToken;
};

UserSchema.methods.createVerificationToken = function (
  this: UserDocument,
): string {
  const verificationToken = jwt.sign(
    { email: this.email },
    requireEnv("JWT_VERIFICATION_SECRET"),
    {
      expiresIn: process.env
        .JWT_VERIFICATION_TIMESPAN as SignOptions["expiresIn"],
    },
  );
  return verificationToken;
};

UserSchema.methods.createResetToken = function (this: UserDocument): string {
  const resetToken = jwt.sign(
    { email: this.email },
    requireEnv("JWT_RESET_SECRET"),
    {
      expiresIn: process.env.JWT_RESET_TIMESPAN as SignOptions["expiresIn"],
    },
  );
  return resetToken;
};

const User: UserModel = mongoose.model<UserRecord, UserModel>(
  "User",
  UserSchema,
);

export default User;
