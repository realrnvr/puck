import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { UnauthorziedError } from "../errors/unauthorizedError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { StatusCodes } from "http-status-codes";
import { mailer } from "../services/mailer.js";
import { revokeGoogleAccess } from "../utils/revokeGoogleAccess.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { setRefreshTokenCookie } from "../helper/setRefreshTokenCookie.js";
import { mailTemplate } from "../utils/mailTemplate.js";
import { oauthClient } from "../config/oauthClient.js";

export const signup = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser && !existingUser.isVerified) {
    return res.status(StatusCodes.CONFLICT).json({
      type: "verification-incomplete",
      message: "Account exists but is not verified, please verify your email",
      email: existingUser.email,
    });
  }

  const user = await User.create({ ...req.body });

  const verificationToken = user.verificationToken;

  const verificationLink = `${CLIENT_APP_URL}/verified/${verificationToken}`;

  mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "email-verification",
    }),
  });

  return res.status(StatusCodes.CREATED).json({ user });
};

export const verification = async (req, res) => {
  const { verificationId } = req.params;
  if (!verificationId) {
    throw new UnauthorziedError("Unauthorized.");
  }

  const payload = jwt.verify(
    verificationId,
    process.env.JWT_VERIFICATION_SECRET
  );

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new NotFoundError("User is not Found.");
  }
  if (user.isVerified) {
    throw new BadRequestError("User is already verified.");
  }

  if (verificationId !== user.verificationToken) {
    throw new UnauthorziedError("Use latest sent verification link.");
  }
  user.isVerified = true;
  await user.save();

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  setRefreshTokenCookie(res, refreshToken);

  return res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new NotFoundError("Please provide email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("user does not exists.");
  }
  if (user.isVerified) {
    throw new BadRequestError("user is already verified.");
  }

  const verificationToken = user.createVerificationToken();
  user.verificationToken = verificationToken;
  await user.save();

  const verificationLink = `${CLIENT_APP_URL}/verified/${verificationToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "email-verification",
    }),
  });

  return res
    .status(StatusCodes.OK)
    .json({ user, message: "New verification link sent to your email." });
};

export const loginAuthOne = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please Provide a email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("no account found with this email.");
  }

  if (!user.isVerified) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "user is not verified",
      type: "email",
      email: user.email,
    });
  }

  if (!user.password) {
    return res
      .status(StatusCodes.OK)
      .json({ user, navigate: "loginGoogleAuth" });
  }

  return res.status(StatusCodes.OK).json({ user, navigate: "loginTwo" });
};

export const loginGoogleAuthTwo = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    throw new BadRequestError("please provide credentials");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("passwords should match");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("no account found with this email.");
  }
  if (!user.isVerified) {
    throw new UnauthorziedError("please verify your email.");
  }

  user.type = "both";
  user.password = password;
  await user.save();

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  setRefreshTokenCookie(res, refreshToken);

  return res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
};

export const loginAuthTwo = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide credentials");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("no account found with this email.");
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
  setRefreshTokenCookie(res, refreshToken);

  return res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED).json({
      message: "Session expired please login again!",
      type: "refresh-token-expired",
    });
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return res
      .clearCookie("refreshToken")
      .status(StatusCodes.NETWORK_AUTHENTICATION_REQUIRED)
      .json({
        message: "Session expired please login again!",
        type: "refresh-token-expired",
      });
  }

  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorziedError("User doesnt exists!");
  }

  if (!user.refreshToken) {
    const accessToken = user.createAccessToken();
    return res.status(StatusCodes.OK).json({ accessToken });
  }

  const response = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: user.refreshToken,
    grant_type: "refresh_token",
  });

  const accessToken = user.createAccessToken();
  const googleAccessToken = response.data.access_token;

  return res.status(StatusCodes.OK).json({ accessToken, googleAccessToken });
};

export const me = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.json({ isAuthenticated: false });
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return res.json({ isAuthenticated: false });
  }

  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ isAuthenticated: false });
  }

  const accessToken = user.createAccessToken();

  return res
    .status(StatusCodes.OK)
    .json({ isAuthenticated: true, accessToken });
};

export const logout = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No refresh token found. Already logged out?" });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    SameSite: "Strict",
  });

  return res.status(StatusCodes.OK).json({ message: "Logout successful!" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("user not found.");
  }

  const resetToken = user.createResetToken();
  user.resetToken = resetToken;
  await user.save();

  const verificationLink = `${CLIENT_APP_URL}/reset-password/${resetToken}`;

  await mailer({
    to: user.email,
    subject: "Reset Password",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "reset-password",
    }),
  });

  return res.status(StatusCodes.OK).json({ user, message: "Reset link sent!" });
};

export const resetPassword = async (req, res) => {
  const {
    params: { verificationId },
    body: { newPassword },
  } = req;

  const payload = jwt.verify(verificationId, process.env.JWT_RESET_SECRET);

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new NotFoundError("user does not exist");
  }

  if (verificationId !== user.resetToken) {
    throw new UnauthorziedError("Use the latest link shared");
  }

  user.password = newPassword;
  await user.save();

  return res.status(StatusCodes.OK).json({ message: "Password updated." });
};

export const resendPasswordVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("user does not exists.");
  }
  if (!user.isVerified) {
    throw new UnauthorziedError("user is not verified.");
  }

  const resetToken = user.createResetToken();
  user.resetToken = resetToken;
  await user.save();

  const verificationLink = `${CLIENT_APP_URL}/reset-password/${resetToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "reset-password",
    }),
  });

  return res
    .status(StatusCodes.OK)
    .json({ user, message: "New verification link sent to your email." });
};

export const google = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new UnauthorziedError("Please provide Google auth code!");
  }

  const { tokens } = await oauthClient.getToken(code);
  if (!tokens) {
    throw new UnauthorziedError("Google code is invalid");
  }

  const { refresh_token, id_token } = tokens;

  const ticket = await oauthClient.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  if (!ticket) {
    throw new NotFoundError("User credentials cannot be used");
  }

  const payload = ticket.getPayload();

  if (!payload) {
    throw new BadRequestError("User credentials cannot be fetched");
  }

  const email = payload.email;
  const googleId = payload.sub;
  const username = payload.name;

  let user = await User.findOne({ email });

  if (!user) {
    // User does not exist, create a new user
    user = new User({
      email,
      username,
      googleId,
      refreshToken: refresh_token,
      isVerified: true,
      type: "google",
    });
    await user.save();
  } else {
    // User exists
    if (!user.isVerified) {
      user.isVerified = true;
    }

    // Update refresh token if not already stored
    if (!user.refreshToken && refresh_token) {
      user.refreshToken = refresh_token;
    }

    if (user.type === "normal") {
      user.type = "both";
    }

    // Save changes only if necessary
    if (user.isModified()) {
      await user.save();
    }
  }

  // Generate tokens
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  setRefreshTokenCookie(res, refreshToken);

  // Return the response
  return res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
};

// dev only
export const deleteUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequestError("Please provide user id");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Revoke Google access if refreshToken exists
  if (user.googleId && user.refreshToken) {
    await revokeGoogleAccess(user.refreshToken);
  }

  await User.deleteOne({ _id: userId });
  return res
    .status(StatusCodes.OK)
    .json({ message: "User deleted successfully" });
};
