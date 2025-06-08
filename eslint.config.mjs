// eslint.config.mjs
import { defineConfig } from "eslint/config";

import expoConfig from "eslint-config-expo/flat.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    ignores: [
      "dist/*",
      "node_modules/*",
      "figma/*",
      "tailwind.config.ts",
      "metro.config.js",
    ],
  },
]);
