import baseConfig from "@standard-store/eslint-config";

export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  { ignores: ["dist/"] },
];
