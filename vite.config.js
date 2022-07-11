import { fileURLToPath, URL } from "url";
import Components from "unplugin-vue-components/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/],
      reactivityTransform: true
    }),

    AutoImport({
      imports: ["vue", "vue-router", "vue-i18n", "vue/macros", "@vueuse/head", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
    }),
    ,
    Components({
      // relative paths to the directory to search for components.
      dirs: ["src/**/components"],
      // valid file extensions for components.
      extensions: ["vue"],
      // search for subdirectories
      deep: true,
      // resolvers for custom components
      resolvers: [HeadlessUiResolver()],
      // generate `components.d.ts` global declarations,
      // also accepts a path for custom filename
      // default: `true` if package typescript is installed
      dts: "src/components.d.ts",
      // filters for transforming targets
      include: [/\.vue$/, /\.vue\?vue/],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-16x16.png", "favicon-32x32.png", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "HiveHub.dev",
        short_name: "HiveHub.dev",
        description: "A block explorer for the Hive ecosystem",
        theme_color: "#1e293b",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
