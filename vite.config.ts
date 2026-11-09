import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    // `npm run dev:api` serves the Grape Bot function on 8788 (Cloudflare's local runtime).
    proxy: { "/api": "http://127.0.0.1:8788" },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon-180x180.png"],
      manifest: {
        id: "/",
        name: "Niagara Grapes",
        short_name: "Grapes",
        description: "All about Niagara grapes, with Grape Bot to chat with.",
        theme_color: "#5b8a2d",
        background_color: "#f7f5ec",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the app shell so it opens offline; never cache the chatbot.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
  ],
});
