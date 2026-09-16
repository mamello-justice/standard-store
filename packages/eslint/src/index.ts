import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import eslint from "@eslint/js";
import type { Linter } from "eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: Linter.Config[] = [
  // === Recommended ===
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // === Imports ===
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^node:", "^react", "^react-dom", "^@?\\w"],
            ["^"],
            ["^@/"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  // === Custom ===
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  { ignores: ["dist/"] },
];

export const eslintConfig: Linter.Config[] = config;

export default config;
