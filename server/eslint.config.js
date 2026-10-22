import js from "@eslint/js";
import globals from "globals";
import n from "eslint-plugin-n";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["node_modules/**", "dist/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  n.configs["flat/recommended-module"],
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    settings: {
      n: {
        version: ">=22.0.0",
        resolverConfig: {
          extensionAlias: {
            ".js": [".ts", ".js"],
            ".mjs": [".mts", ".mjs"],
            ".cjs": [".cts", ".cjs"],
          },
        },
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "no-prototype-builtins": "warn",
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
  {
    files: ["eslint.config.js", "vitest.config.js", "test/**/*.js"],
    rules: { "n/no-unpublished-import": "off" },
  },
  {
    files: ["populate.ts"],
    rules: { "n/no-process-exit": "off" },
  },
];
