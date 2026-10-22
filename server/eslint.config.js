import js from "@eslint/js";
import globals from "globals";
import n from "eslint-plugin-n";

export default [
  { ignores: ["node_modules/**", "dist/**", "coverage/**"] },
  js.configs.recommended,
  n.configs["flat/recommended-module"],
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "no-prototype-builtins": "warn",
      "no-console": "off",
    },
  },
  {
    files: ["eslint.config.js"],
    rules: { "n/no-unpublished-import": "off" },
  },
  {
    files: ["populate.js"],
    rules: { "n/no-process-exit": "off" },
  },
];
