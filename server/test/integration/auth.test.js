import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import User from "../../models/auth.js";
import { createGoogleUser, createUser, getCookie } from "../helpers/auth.js";

const app = createApp();

const login = (email, password) =>
  request(app).post("/api/v1/auth/loginAuthTwo").send({ email, password });

const bearer = (user) => `Bearer ${user.createAccessToken()}`;

describe("signup", () => {
  it("returns a sanitized user and does not persist unverified fields", async () => {
    const email = "reader@example.com";

    const response = await request(app).post("/api/v1/auth/signup").send({
      username: "reader",
      email,
      password: "Password1!",
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ username: "reader", email });
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).not.toHaveProperty("verificationToken");
    expect(response.body.user).not.toHaveProperty("resetToken");
    expect(response.body.user).not.toHaveProperty("refreshToken");

    const user = await User.findOne({ email }).select("+verificationToken");
    expect(user).not.toBeNull();
    expect(user.isVerified).toBe(false);
    expect(user.verificationToken).toBeTruthy();
  });

  it("rejects fields that are not allowlisted", async () => {
    const email = "attacker@example.com";

    const response = await request(app).post("/api/v1/auth/signup").send({
      username: "attacker",
      email,
      password: "Password1!",
      isVerified: true,
      type: "google",
      googleId: "attacker-google-id",
    });

    expect(response.status).toBe(400);
    expect(await User.findOne({ email })).toBeNull();
  });
});

describe("loginAuthOne", () => {
  it("returns a public user document without secrets", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .post("/api/v1/auth/loginAuthOne")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body.navigate).toBe("loginTwo");
    expect(response.body.user).toMatchObject({
      username: user.username,
      email: user.email,
    });
    expect(response.body.user).not.toHaveProperty("password");
    expect(response.body.user).not.toHaveProperty("verificationToken");
    expect(response.body.user).not.toHaveProperty("resetToken");
    expect(response.body.user).not.toHaveProperty("refreshToken");
  });

  it("does not send Google users to the unauthenticated password page", async () => {
    const user = await createGoogleUser();

    const response = await request(app)
      .post("/api/v1/auth/loginAuthOne")
      .send({ email: user.email });

    expect(response.status).toBe(409);
    expect(response.body.type).toBe("google-account");
    expect(response.body).not.toHaveProperty("user");
    expect(response.body).not.toHaveProperty("navigate");
  });
});

describe("authorization middleware", () => {
  it("returns 401 when the Authorization header is missing", async () => {
    const response = await request(app).get("/api/v1/client/user");

    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty("statusCode");
  });

  it("returns 401 when the access token is invalid", async () => {
    const response = await request(app)
      .get("/api/v1/client/user")
      .set("Authorization", "Bearer not-a-token");

    expect(response.status).toBe(401);
  });

  it("allows a valid access token", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .get("/api/v1/client/user")
      .set("Authorization", bearer(user));

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
  });
});

describe("deleteUser", () => {
  it("rejects unauthenticated deletion", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .delete("/api/v1/auth/deleteUser")
      .send({ userId: user._id.toString() });

    expect(response.status).toBe(401);
    expect(await User.findById(user._id)).not.toBeNull();
  });

  it("deletes the authenticated user and ignores a different body userId", async () => {
    const attacker = await createUser();
    const victim = await createUser();

    const response = await request(app)
      .delete("/api/v1/auth/deleteUser")
      .set("Authorization", bearer(attacker.user))
      .send({ userId: victim.user._id.toString() });

    expect(response.status).toBe(200);
    expect(await User.findById(attacker.user._id)).toBeNull();
    expect(await User.findById(victim.user._id)).not.toBeNull();
  });
});

describe("session revocation", () => {
  it("sets a local-development-safe cookie", async () => {
    const { user, password } = await createUser();

    const response = await login(user.email, password);
    const cookie = getCookie(response);

    expect(response.status).toBe(200);
    expect(cookie).toBeTruthy();
    expect(response.headers["set-cookie"].join(";")).toMatch(/HttpOnly/i);
    expect(response.headers["set-cookie"].join(";")).toMatch(
      /SameSite=Strict/i,
    );
    expect(response.headers["set-cookie"].join(";")).toMatch(/Max-Age=604800/);
    expect(response.headers["set-cookie"].join(";")).not.toMatch(/Secure/);
  });

  it("revokes the old refresh token on logout", async () => {
    const { user, password } = await createUser();
    const loginResponse = await login(user.email, password);
    const cookie = getCookie(loginResponse);

    const logoutResponse = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", cookie);

    expect(logoutResponse.status).toBe(200);

    const refreshResponse = await request(app)
      .get("/api/v1/auth/refreshToken")
      .set("Cookie", cookie);

    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.body.type).toBe("refresh-token-expired");
  });

  it("revokes the old refresh token after a password change", async () => {
    const { user, password } = await createUser();
    const loginResponse = await login(user.email, password);
    const cookie = getCookie(loginResponse);

    const changeResponse = await request(app)
      .patch("/api/v1/client/update-password")
      .set("Authorization", bearer(user))
      .send({
        oldPassword: password,
        newPassword: "NewPassword1!",
        confirmNewPassword: "NewPassword1!",
      });

    expect(changeResponse.status).toBe(200);

    const refreshResponse = await request(app)
      .get("/api/v1/auth/refreshToken")
      .set("Cookie", cookie);

    expect(refreshResponse.status).toBe(401);
  });

  it("revokes the old refresh token after a password reset", async () => {
    const { user, password } = await createUser();
    const loginResponse = await login(user.email, password);
    const cookie = getCookie(loginResponse);

    const resetToken = user.createResetToken();
    user.resetToken = resetToken;
    await user.save();

    const resetResponse = await request(app)
      .post(`/api/v1/auth/resetPassword/${resetToken}`)
      .send({
        newPassword: "ResetPassword1!",
        confirmPassword: "ResetPassword1!",
      });

    expect(resetResponse.status).toBe(200);

    const refreshResponse = await request(app)
      .get("/api/v1/auth/refreshToken")
      .set("Cookie", cookie);

    expect(refreshResponse.status).toBe(401);
  });

  it("lets a Google user set a password through the reset flow", async () => {
    const user = await createGoogleUser();
    const resetToken = user.createResetToken();
    user.resetToken = resetToken;
    await user.save();

    const resetResponse = await request(app)
      .post(`/api/v1/auth/resetPassword/${resetToken}`)
      .set("X-Forwarded-For", "203.0.113.10")
      .send({
        newPassword: "ResetPassword1!",
        confirmPassword: "ResetPassword1!",
      });

    expect(resetResponse.status).toBe(200);

    const updatedUser = await User.findById(user._id).select("+password");
    expect(updatedUser.type).toBe("both");

    const loginResponse = await login(user.email, "ResetPassword1!");
    expect(loginResponse.status).toBe(200);

    const loginOneResponse = await request(app)
      .post("/api/v1/auth/loginAuthOne")
      .send({ email: user.email });

    expect(loginOneResponse.status).toBe(200);
  });
});

describe("loginGoogleAuthTwo", () => {
  it("rejects unauthenticated password creation", async () => {
    const response = await request(app)
      .post("/api/v1/auth/loginGoogleAuthTwo")
      .send({
        email: "victim@example.com",
        password: "Password1!",
        confirmPassword: "Password1!",
      });

    expect(response.status).toBe(401);
  });

  it("allows a Google user to create a password for their own account", async () => {
    const user = await createGoogleUser();

    const response = await request(app)
      .post("/api/v1/auth/loginGoogleAuthTwo")
      .set("Authorization", bearer(user))
      .send({
        password: "Password1!",
        confirmPassword: "Password1!",
      });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      email: user.email,
      type: "both",
    });

    const updatedUser = await User.findById(user._id).select("+password");
    expect(updatedUser.type).toBe("both");
    expect(await updatedUser.verifyPassword("Password1!")).toBe(true);
  });

  it("rejects password creation for a non-Google account", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .post("/api/v1/auth/loginGoogleAuthTwo")
      .set("Authorization", bearer(user))
      .send({
        password: "Password1!",
        confirmPassword: "Password1!",
      });

    expect(response.status).toBe(400);
  });
});

describe("response sanitization", () => {
  it("does not return the user document from resendVerification", async () => {
    const { user } = await createUser({ isVerified: false });

    const response = await request(app)
      .post("/api/v1/auth/resendVerification")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("user");
    expect(JSON.stringify(response.body)).not.toContain("verificationToken");
  });

  it("does not return the user document from forgotPassword", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .post("/api/v1/auth/forgotPassword")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("user");
    expect(JSON.stringify(response.body)).not.toContain("resetToken");
  });

  it("does not return the user document from resendPasswordVerification", async () => {
    const { user } = await createUser();

    const response = await request(app)
      .post("/api/v1/auth/resendPasswordVerification")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty("user");
    expect(JSON.stringify(response.body)).not.toContain("resetToken");
  });
});

describe("security headers", () => {
  it("sets Helmet headers", async () => {
    const response = await request(app).get("/api/v1/ping");

    expect(response.status).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.headers["cross-origin-resource-policy"]).toBe(
      "cross-origin",
    );
  });
});
