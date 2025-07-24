import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
    allowedHosts: ["formulaire-erasmus-efp.up.railway.app"],
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    proxy: {
      "/api/grist": {
        target: "https://grist.numerique.gouv.fr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/grist/, ""),
        headers: {
          Origin: "https://grist.numerique.gouv.fr",
        },
      },
    },
  },
});
