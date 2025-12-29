// eslint.config.mjs
import { defineConfig } from "eslint/config";

import expoConfig from "eslint-config-expo/flat.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import eslint from "@eslint/js";
import { configs as tseslintConfig } from "typescript-eslint";

export default defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  eslint.configs.recommended,
  tseslintConfig.recommended,
  {
    rules: {
      "prettier/prettier": "error",
      "no-undef": "error",
    },
  },
  {
    ignores: [
      "dist/*",
      "node_modules/*",
      "figma/*",
      "tailwind.config.ts",
      "metro.config.js",
      "orval/*",
    ],
  },
]);
