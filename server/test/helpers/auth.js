import { randomUUID } from "node:crypto";
import User from "../../models/auth.js";

const uniqueSuffix = () => randomUUID().replaceAll("-", "").slice(0, 10);

export const createUser = async (overrides = {}) => {
  const suffix = uniqueSuffix();
  const password = overrides.password ?? "Password1!";

  const user = await User.create({
    username: `user_${suffix}`,
    email: `user_${suffix}@example.com`,
    password,
    isVerified: true,
    ...overrides,
  });

  return { user, password, email: user.email, username: user.username };
};

export const createGoogleUser = async (overrides = {}) => {
  const suffix = uniqueSuffix();

  return User.create({
    username: `google_${suffix}`,
    email: `google_${suffix}@example.com`,
    googleId: `google-${suffix}`,
    type: "google",
    isVerified: true,
    ...overrides,
  });
};

export const getCookie = (response) => {
  const setCookie = response.headers["set-cookie"];

  if (!setCookie || setCookie.length === 0) {
    return undefined;
  }

  return setCookie[0].split(";")[0];
};
