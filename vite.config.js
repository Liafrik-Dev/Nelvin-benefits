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
    host: true,
    allowedHosts: [".prod-runtime.all-hands.dev", "localhost", "127.0.0.1"],
  },
  preview: {
    host: true,
    // A leading dot matches the domain and all of its subdomains. The runtime
    // hostname changes on every session (work-1-<random>.prod-runtime…), so a
    // hardcoded entry is guaranteed to go stale and Vite then answers every
    // request with "Blocked request. This host is not allowed." — which takes
    // the whole app, login included, offline until someone edits this file.
    allowedHosts: [".prod-runtime.all-hands.dev", "localhost", "127.0.0.1"],
  },
});