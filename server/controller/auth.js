import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import UnauthorziedError from "../errors/unauthorizedError.js";
import BadRequestError from "../errors/badRequestError.js";
import mailer from "../services/mailer.js";

export const signup = async (req, res) => {
  const user = await User.create({ ...req.body });
  const verificationToken = user.verificationToken;

  const verificationLink = `http://localhost:5173/verified/${verificationToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: `<h2>Hi ${user.username}</h2>
    <p>To finish setting up your account and start using Puck, please verify your email address.</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire after 15 minutes. To request another verification link, please log in to prompt a re-send link.</p>
    `,
  });

  res.status(StatusCodes.CREATED).json({ user });
};

export const verification = async (req, res) => {
  const { verificationId } = req.params;

  if (!verificationId) {
    throw new UnauthorziedError("Unauthorized.");
  }

  try {
    const payload = jwt.verify(
      verificationId,
      process.env.JWT_VERIFICATION_SECRET
    );

    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw new BadRequestError("User is not Found.");
    }

    if (user.isVerified) {
      throw new BadRequestError("User is already verified.");
    }

    if (verificationId !== user.verificationToken) {
      throw new UnauthorziedError("Use latest sent verification link.");
    }

    user.isVerified = true;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "email verified successfully." });
  } catch (error) {
    if (error.message === "User is already verified.") {
      throw new BadRequestError("User is already verified.");
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "This link has been expired" });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorziedError("user does not exists.");
  }

  if (user.isVerified) {
    throw new BadRequestError("user is already verified.");
  }

  const verificationToken = user.createVerificationToken();
  user.verificationToken = verificationToken;
  await user.save();

  const verificationLink = `http://localhost:5173/verified/${verificationToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: `<h2>Hi ${user.username}</h2>
    <p>To finish setting up your account and start using Puck, please verify your email address.</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire after 15 minutes. To request another verification link, please log in to prompt a re-send link.</p>
    `,
  });

  res
    .status(StatusCodes.OK)
    .json({ user, message: "New verification link sent to your email." });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("please Provide Credentials.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorziedError("no account found with this email.");
  }

  if (!user.isVerified) {
    throw new UnauthorziedError("please verify your email.");
  }

  const isCorrect = await user.verifyPassword(password);
  if (!isCorrect) {
    throw new UnauthorziedError("password is incorrect.");
  }

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    SameSite: "Strict",
    maxAge: process.env.JWT_REFRESH_TIMESPAN * 1000,
  });

  res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new UnauthorziedError("Refresh token expired!");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { email } = payload;

    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorziedError("Refresh token expired!");
    }

    const accessToken = user.createAccessToken();

    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    throw new UnauthorziedError("Refresh token expired!");
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(StatusCodes.OK).json({ message: "Logout successFull!" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("user not found.");
  }

  const resetToken = user.createResetToken();
  user.resetToken = resetToken;
  await user.save();

  const verificationLink = `http://localhost:5173/reset-password/${resetToken}`;

  await mailer({
    to: email,
    subject: "Reset Password",
    html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="${verificationLink}">here</a>
        <p>The link will expire in 15 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
  });

  res.status(StatusCodes.OK).json({ user, message: "Reset link sent!" });
};

export const resetPassword = async (req, res) => {
  const {
    params: { verificationId },
    body: { newPassword },
  } = req;

  try {
    const payload = jwt.verify(verificationId, process.env.JWT_RESET_SECRET);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw new BadRequestError("user does not exist");
    }

    if (verificationId !== user.resetToken) {
      throw new UnauthorziedError("Use the latest link shared");
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({ message: "Password updated." });
  } catch (error) {
    // res
    //   .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ message: error.message || "something went wrong" });
    res.status(500).json({ message: error.message });
  }
};

export const resendPasswordVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorziedError("user does not exists.");
  }

  if (!user.isVerified) {
    throw new BadRequestError("user is not verified.");
  }

  const resetToken = user.createResetToken();
  user.resetToken = resetToken;
  await user.save();

  const verificationLink = `http://localhost:5173/reset-password/${resetToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: `<h2>Hi ${user.username}</h2>
    <p>To reset your password and start using Puck, please verify your email address.</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire after 15 minutes. To request another verification link, please log in to prompt a re-send link.</p>
    `,
  });

  res
    .status(StatusCodes.OK)
    .json({ user, message: "New verification link sent to your email." });
};
