import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger"; // Removed lovable-tagger

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true, // Prevents Vite from automatically selecting a different port
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/SyncDoc_mvp",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));