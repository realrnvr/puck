import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import { UnauthorziedError } from "../errors/unauthorizedError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { StatusCodes } from "http-status-codes";
import { mailer } from "../services/mailer.js";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

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

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    SameSite: "Strict",
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  });

  res.status(StatusCodes.OK).json({
    user: { username: user.username, email: user.email },
    accessToken,
  });
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

export const loginAuthOne = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please Provide a email.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorziedError("no account found with this email.");
  }

  if (!user.password) {
    return res
      .status(StatusCodes.OK)
      .json({ user, navigate: "loginGoogleAuth" });
  }

  res.status(StatusCodes.OK).json({ user, navigate: "loginTwo" });
};

export const loginGoogleAuthTwo = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    throw new BadRequestError("please provide credentials");
  }

  if (password != confirmPassword) {
    throw new BadRequestError("passwords should match");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorziedError("no account found with this email.");
  }

  if (!user.isVerified) {
    throw new UnauthorziedError("please verify your email.");
  }

  user.password = password;
  await user.save();

  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    SameSite: "Strict",
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
  });

  res.status(StatusCodes.OK).json({
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
    maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
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

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorziedError("Refresh token expired!");
  }

  const accessToken = user.createAccessToken();

  res.status(StatusCodes.OK).json({ accessToken });
};

export const me = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.json({ isAuthenticated: false });
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ isAuthenticated: false });
  }

  const accessToken = user.createAccessToken();

  res.status(StatusCodes.OK).json({ isAuthenticated: true, accessToken });
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

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const google = async (req, res) => {
  const { code } = req.body;
  console.log("Received code:", code);

  try {
    const { tokens } = await client.getToken(code);
    const { refresh_token, access_token, id_token } = tokens;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;
    const username = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        username,
        googleId,
        refreshToken: refresh_token,
        isVerified: true,
      });
    } else {
      if (!user.refreshToken && refresh_token) {
        user.refreshToken = refresh_token;
      }
    }

    await user.save();
    const accessToken = user.createAccessToken();
    const refreshToken = user.createRefreshToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      SameSite: "Strict",
      maxAge: Number(process.env.JWT_REFRESH_TIMESPAN) * 1000,
    });

    res.status(StatusCodes.OK).json({
      user: { username: user.username, email: user.email },
      accessToken,
    });
  } catch (error) {
    console.error("Error during Google login:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
};

const revokeGoogleAccess = async (refreshToken) => {
  try {
    await axios.post("https://oauth2.googleapis.com/revoke", null, {
      params: { token: refreshToken },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Successfully revoked Google access");
  } catch (error) {
    console.error(
      "Error revoking Google access:",
      error.response?.data || error.message
    );
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Revoke Google access if refreshToken exists
    if (user.googleId && user.refreshToken) {
      await revokeGoogleAccess(user.refreshToken);
    }

    // Delete user from the database
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
