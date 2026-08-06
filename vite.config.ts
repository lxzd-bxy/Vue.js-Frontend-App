import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(() => {
  return {
    plugins: [vue(), tailwindcss(), basicSsl()],
    server: {
      proxy: {
        "/api": {
          target: "https://localhost:7281",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
