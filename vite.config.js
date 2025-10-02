import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // If deploying to https://USERNAME.github.io/REPO/, set base to "/REPO/"
  // If deploying to https://USERNAME.github.io (user site), set base to "/"
  base: "/SSB-Forms/"
});
