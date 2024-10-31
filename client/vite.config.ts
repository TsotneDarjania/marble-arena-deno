import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { renameSync } from "fs";

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      name: "rename-html-to-ejs",
      writeBundle() {
        // Rename `dist/index.html` to `dist/index.ejs` after the build
        try {
          renameSync("dist/index.html", "dist/index.ejs");
        } catch (error) {
          console.error("Error renaming index.html to index.ejs:", error);
        }
      },
    },
  ],
  server: {
    port: 9001,
  },
  build: {
    target: "esnext",
  },
});
