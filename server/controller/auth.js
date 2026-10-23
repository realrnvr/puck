import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { StatusCodes } from "http-status-codes";
import { mailer } from "../services/mailer.js";
import { revokeGoogleAccess } from "../utils/revokeGoogleAccess.js";
import { NotFoundError } from "../errors/notFoundError.js";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "../helper/setRefreshTokenCookie.js";
import { mailTemplate } from "../utils/mailTemplate.js";
import { oauthClient } from "../config/oauthClient.js";
import { toPublicUser } from "../utils/publicUser.js";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one Uppercase letter")
  .regex(/[a-z]/, "At least one Lowercase letter")
  .regex(/\d/, "At least one Digit")
  .regex(/[\W_]/, "At least one Special character");

const SignupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, "At least 4 characters")
      .max(50, "Cannot exceed 50 characters")
      .regex(/^[a-zA-Z0-9._]+$/, {
        message: "Only letters, numbers, dots, and underscores allowed.",
      })
      .refine((value) => !value.startsWith(".") && !value.startsWith("_"), {
        message: "Cannot start with a dot or underscore",
      })
      .refine((value) => !value.endsWith(".") && !value.endsWith("_"), {
        message: "Cannot end with a dot or underscore",
      }),
    email: z.string().trim().email("Valid email."),
    password: passwordSchema,
  })
  .strict();

const GooglePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const ResetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const firstValidationError = (result, fallback) => {
  const issue = result.error.issues[0];
  return new BadRequestError(
    issue?.message ?? fallback,
    issue?.path?.[0] ?? null,
  );
};

const rejectRefreshToken = (res) => {
  clearRefreshTokenCookie(res);

  return res.status(StatusCodes.UNAUTHORIZED).json({
    message: "Session expired please login again!",
    type: "refresh-token-expired",
  });
};

const bumpTokenVersion = (user) => {
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
};

const createSession = (res, user) => {
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  setRefreshTokenCookie(res, refreshToken);

  return accessToken;
};

export const signup = async (req, res) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    throw firstValidationError(parsed, "Invalid signup details.");
  }

  const { username, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser && !existingUser.isVerified) {
    return res.status(StatusCodes.CONFLICT).json({
      type: "verification-incomplete",
      message: "Account exists but is not verified, please verify your email",
      email: existingUser.email,
    });
  }

  const user = await User.create({ username, email, password });

  const verificationToken = user.verificationToken;
  const verificationLink = `${process.env.CLIENT_APP_URL}/verified/${verificationToken}`;

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
    .status(StatusCodes.CREATED)
    .json({ user: toPublicUser(user), message: "Verification email sent." });
};

export const verification = async (req, res) => {
  const { verificationId } = req.params;
  if (!verificationId) {
    throw new UnauthorizedError("Unauthorized.");
  }

  const payload = jwt.verify(
    verificationId,
    process.env.JWT_VERIFICATION_SECRET,
  );

  if (!payload?.email) {
    throw new UnauthorizedError("Invalid verification token.");
  }

  const user = await User.findOne({ email: payload.email }).select(
    "+verificationToken",
  );
  if (!user) {
    throw new NotFoundError("User is not Found.");
  }
  if (user.isVerified) {
    throw new BadRequestError("User is already verified.");
  }

  if (verificationId !== user.verificationToken) {
    throw new UnauthorizedError("Use latest sent verification link.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  const accessToken = createSession(res, user);

  return res.status(StatusCodes.OK).json({
    user: toPublicUser(user),
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

  const verificationLink = `${process.env.CLIENT_APP_URL}/verified/${verificationToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "email-verification",
    }),
  });

  return res.status(StatusCodes.OK).json({
    message: "New verification link sent to your email.",
  });
};

export const loginAuthOne = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please Provide a email.");
  }

  const user = await User.findOne({ email }).select("+password");
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
    return res.status(StatusCodes.CONFLICT).json({
      type: "google-account",
      message:
        "This account uses Google sign-in. Continue with Google or reset your password via email.",
    });
  }

  return res.status(StatusCodes.OK).json({
    user: toPublicUser(user),
    navigate: "loginTwo",
  });
};

export const loginGoogleAuthTwo = async (req, res) => {
  const parsed = GooglePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw firstValidationError(parsed, "Invalid password details.");
  }

  const user = await User.findById(req.user.userId).select("+password");
  if (!user) {
    throw new NotFoundError("no account found for this session.");
  }

  if (user.type === "normal" || user.password) {
    throw new BadRequestError(
      "This account already has a password or is not a Google account.",
      "password",
    );
  }

  user.type = "both";
  user.password = parsed.data.password;
  await user.save();

  const accessToken = createSession(res, user);

  return res.status(StatusCodes.OK).json({
    user: toPublicUser(user),
    accessToken,
  });
};

export const loginAuthTwo = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide credentials");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new NotFoundError("no account found with this email.");
  }
  if (!user.isVerified) {
    throw new UnauthorizedError("please verify your email.");
  }
  if (!user.password) {
    throw new BadRequestError(
      "This account uses Google sign-in.",
      "google-account",
    );
  }

  const isCorrect = await user.verifyPassword(password);
  if (!isCorrect) {
    throw new UnauthorizedError("password is incorrect.");
  }

  const accessToken = createSession(res, user);

  return res.status(StatusCodes.OK).json({
    user: toPublicUser(user),
    accessToken,
  });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return rejectRefreshToken(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return rejectRefreshToken(res);
  }

  if (!payload?.email) {
    return rejectRefreshToken(res);
  }

  const user = await User.findOne({ email: payload.email }).select(
    "+refreshToken",
  );
  if (!user) {
    return rejectRefreshToken(res);
  }

  if ((payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
    return rejectRefreshToken(res);
  }

  if (!user.refreshToken) {
    const accessToken = user.createAccessToken();
    return res.status(StatusCodes.OK).json({ accessToken });
  }

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: user.refreshToken,
      grant_type: "refresh_token",
    });

    const accessToken = user.createAccessToken();
    const googleAccessToken = response.data.access_token;

    return res.status(StatusCodes.OK).json({ accessToken, googleAccessToken });
  } catch {
    return rejectRefreshToken(res);
  }
};

export const me = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    clearRefreshTokenCookie(res);
    return res.json({ isAuthenticated: false });
  }

  if (!payload?.email) {
    clearRefreshTokenCookie(res);
    return res.json({ isAuthenticated: false });
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) {
    clearRefreshTokenCookie(res);
    return res.json({ isAuthenticated: false });
  }

  if ((payload.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
    clearRefreshTokenCookie(res);
    return res.json({ isAuthenticated: false });
  }

  const accessToken = user.createAccessToken();

  return res
    .status(StatusCodes.OK)
    .json({ isAuthenticated: true, accessToken });
};

export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      if (payload?.email) {
        const user = await User.findOne({ email: payload.email });

        if (user) {
          bumpTokenVersion(user);
          await user.save();
        }
      }
    } catch {
      // An invalid or expired token is already useless; still clear the cookie.
    }
  }

  clearRefreshTokenCookie(res);

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

  const verificationLink = `${process.env.CLIENT_APP_URL}/reset-password/${resetToken}`;

  await mailer({
    to: user.email,
    subject: "Reset Password",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "reset-password",
    }),
  });

  return res.status(StatusCodes.OK).json({ message: "Reset link sent!" });
};

export const resetPassword = async (req, res) => {
  const {
    params: { verificationId },
    body,
  } = req;

  const parsed = ResetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    throw firstValidationError(parsed, "Invalid password details.");
  }

  const payload = jwt.verify(verificationId, process.env.JWT_RESET_SECRET);

  if (!payload?.email) {
    throw new UnauthorizedError("Invalid reset token.");
  }

  const user = await User.findOne({ email: payload.email }).select(
    "+resetToken",
  );
  if (!user) {
    throw new NotFoundError("user does not exist");
  }

  if (verificationId !== user.resetToken) {
    throw new UnauthorizedError("Use the latest link shared");
  }

  user.password = parsed.data.newPassword;
  user.resetToken = undefined;
  if (user.googleId) {
    user.type = "both";
  }
  bumpTokenVersion(user);
  await user.save();
  clearRefreshTokenCookie(res);

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
    throw new UnauthorizedError("user is not verified.");
  }

  const resetToken = user.createResetToken();
  user.resetToken = resetToken;
  await user.save();

  const verificationLink = `${process.env.CLIENT_APP_URL}/reset-password/${resetToken}`;

  await mailer({
    to: user.email,
    subject: "Email Address Verification",
    html: mailTemplate({
      username: user.username,
      redirect: verificationLink,
      template: "reset-password",
    }),
  });

  return res.status(StatusCodes.OK).json({
    message: "New verification link sent to your email.",
  });
};

export const google = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new UnauthorizedError("Please provide Google auth code!");
  }

  const { tokens } = await oauthClient.getToken(code);
  if (!tokens) {
    throw new UnauthorizedError("Google code is invalid");
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

  if (!payload?.email || payload.email_verified === false) {
    throw new BadRequestError("User credentials cannot be fetched");
  }

  const email = payload.email;
  const googleId = payload.sub;
  const username = payload.name;

  let user = await User.findOne({ email }).select("+refreshToken");

  if (!user) {
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
    if (!user.isVerified) {
      user.isVerified = true;
    }

    if (!user.refreshToken && refresh_token) {
      user.refreshToken = refresh_token;
    }

    if (user.type === "normal") {
      user.type = "both";
    }

    if (user.isModified()) {
      await user.save();
    }
  }

  const accessToken = createSession(res, user);

  return res.status(StatusCodes.OK).json({
    user: toPublicUser(user),
    accessToken,
  });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId).select("+refreshToken");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.googleId && user.refreshToken) {
    await revokeGoogleAccess(user.refreshToken);
  }

  await User.deleteOne({ _id: userId });
  clearRefreshTokenCookie(res);

  return res
    .status(StatusCodes.OK)
    .json({ message: "User deleted successfully" });
};
