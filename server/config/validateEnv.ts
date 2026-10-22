export const REQUIRED_ENV = [
  "MONGO_URI",
  "CLIENT_APP_URL",
  "API_BASE_URL",
  "DEX_BASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_ACCESS_TIMESPAN",
  "JWT_REFRESH_SECRET",
  "JWT_REFRESH_TIMESPAN",
  "JWT_VERIFICATION_SECRET",
  "JWT_VERIFICATION_TIMESPAN",
  "JWT_RESET_SECRET",
  "JWT_RESET_TIMESPAN",
  "AUTH_USER",
  "AUTH_PASS",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "REDIS_URL",
] as const;

type Env = Record<string, string | undefined>;

export const validateEnv = (env: Env = process.env): void => {
  const missing = REQUIRED_ENV.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};
