import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import plugin from "@tanstack/eslint-plugin-query";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

const a11yWarnings = Object.fromEntries(
  Object.entries(jsxA11y.flatConfigs.recommended.rules)
    .filter(([, value]) => value !== "off")
    .map(([rule, value]) => [
      rule,
      Array.isArray(value) ? ["warn", ...value.slice(1)] : "warn",
    ]),
);

export default [
  ...plugin.configs["flat/recommended"],
  { ignores: ["dist"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...a11yWarnings,
      "react/jsx-no-target-blank": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
];
