import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.{js,ts}"],
    setupFiles: ["./test/setup.js"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["**/*.{js,ts}"],
      exclude: [
        "node_modules/**",
        "test/**",
        "vitest.config.js",
        "eslint.config.js",
        "caseManga.js",
        "populate.js",
      ],
    },
  },
});
