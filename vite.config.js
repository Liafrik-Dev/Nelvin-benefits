import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Nelvin Benefits — Vite configuration.
// - `@/` resolves to the repository root (the app lives under src/, so
//   components/pages/lib imports resolve via src/ + the alias below).
// - Output goes to `dist/` for Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 5173,
  },
});