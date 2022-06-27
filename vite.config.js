import { fileURLToPath, URL } from "url";
import Components from "unplugin-vue-components/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/],
      reactivityTransform: true,
    }),

    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core",
      ],
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
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
