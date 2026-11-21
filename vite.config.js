import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/portal/",
  plugins: [
    react(),
    svgr({ svgrOptions: { exportType: "named", namedExport: "ReactComponent" } }),
    tailwindcss(),
  ],
});
