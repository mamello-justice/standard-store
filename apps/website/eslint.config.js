import eslintPluginAstro from "eslint-plugin-astro";

export default [
  // === Global ===
  {
    ignores: ["node_modules/"],
  },

  // === Recommended ===
  ...eslintPluginAstro.configs.recommended,
];
