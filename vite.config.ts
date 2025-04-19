import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    host: true,
    port: 5010,
    proxy: {
      // 첫 번째 프록시 설정
      "/admin": {
        target: "http://localhost:8010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
        secure: false,
        ws: true,
      },
      "/user": {
        target: "http://13.212.255.35:8020",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, ""),
        secure: false,
        ws: true,
      },
    },
  },
});
