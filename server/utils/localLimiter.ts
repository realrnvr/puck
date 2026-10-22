import rateLimit from "express-rate-limit";

export const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: { message: "Too many requests, please try again later." },
});

export const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1,
  message: { message: "Too many requests, please try again later." },
});
