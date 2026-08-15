import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ tsconfigPath: "./tsconfig.lib.json" })],
  build: {
    lib: {
      entry: {
        "memory/index": "src/memory/index.ts",
        "local-storage/index": "src/local-storage/index.ts",
        "session-storage/index": "src/session-storage/index.ts",
        "react-router/index": "src/react-router/index.ts",
        "nuqs/index": "src/nuqs/index.ts",
        "cookie/index": "src/cookie/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@standard-store/spec", "react-router", "nuqs"],
    },
  },
});
