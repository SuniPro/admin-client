import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@modules/lexical-editor/lexical": path.resolve(
        __dirname,
        "src/modules/lexical-editor/lexical",
      ),
    },
  },
  server: {
    host: true,
    port: 5010,
    proxy: {
      // 첫 번째 프록시 설정
      "/admin": {
        // target: "http://47.129.9.149:8010",
        target: "http://localhost:8010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
        secure: false,
        ws: true,
      },
      "/forward": {
        target: "http://13.212.255.35:8020",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/forward/, ""),
        secure: false,
        ws: true,
      },
      "/tracker": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tracker/, ""),
        secure: false,
        ws: true,
      },
    },
  },
});
