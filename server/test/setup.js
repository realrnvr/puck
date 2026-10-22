import { afterAll, afterEach, beforeAll, vi } from "vitest";

vi.mock("../config/redisClient.js", () => ({
  redisClient: {
    get: vi.fn(),
    setEx: vi.fn(),
    connect: vi.fn(),
    quit: vi.fn(),
  },
}));

vi.mock("../services/mailer.js", () => ({
  mailer: vi.fn(),
}));

process.env.NODE_ENV = "test";
process.env.CLIENT_APP_URL = "http://localhost:5173";
process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.JWT_VERIFICATION_SECRET = "test-verification-secret";
process.env.JWT_RESET_SECRET = "test-reset-secret";
process.env.JWT_ACCESS_TIMESPAN = "15m";
process.env.JWT_REFRESH_TIMESPAN = "604800";
process.env.JWT_VERIFICATION_TIMESPAN = "1h";
process.env.JWT_RESET_TIMESPAN = "1h";
process.env.REDIS_URL = "redis://127.0.0.1:6379";
process.env.AUTH_USER = "test@example.com";
process.env.AUTH_PASS = "test-password";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

import { connectTestDB, clearTestDB, disconnectTestDB } from "./helpers/db.js";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});
