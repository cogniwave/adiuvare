import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { version } from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Quero Ajudar",
      link: [
        {
          rel: "stylesheet",
          href: "https://use.fontawesome.com/releases/v5.0.13/css/brand.css",
        },
        {
          rel: "stylesheet",
          href: "https://use.fontawesome.com/releases/v5.0.13/css/solid.css",
        },
      ],
    },
  },

  ssr: true,

  build: {
    transpile: ["vuetify", "jsonwebtoken"],
  },

  components: [
    { path: "~/components/menu", pathPrefix: false },
    { path: "~/components/common", pathPrefix: false },
    { path: "~/components/feed", pathPrefix: false },
    { path: "~/components/posts", pathPrefix: false },
    "~/components",
  ],

  css: [
    "~/scss/styles.scss", // you should add main.scss somewhere in your app
  ],

  modules: [
    "@nuxtjs/robots",
    "@pinia/nuxt",
    "@nuxtjs/eslint-module",
    "nuxt-bugsnag",
    "@nuxtjs/i18n",
    (_, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
  ],

  eslint: {
    lintOnStart: false,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  pinia: {
    storesDirs: ["~/stores"],
  },

  bugsnag: {
    publishRelease: true,
    disableLog: true,
    baseUrl: process.env.APP_BASE_URL,

    config: {
      releaseStage: process.env.NODE_ENV,
      apiKey: process.env.BUGSNAG_KEY,
      enabledReleaseStages: ["staging", "production"],
      appVersion: version,
    },
  },

  i18n: {
    vueI18n: "./i18n/i18n.config.ts", // if you are using custom path, default
    locales: [
      { code: "pt", iso: "pt-PT", file: "pt.json" },
      { code: "en", iso: "en-GB", file: "en.json" },
    ],
    defaultDirection: "ltr",
    defaultLocale: "pt",
    lazy: true,
    langDir: "i18n",
  },
});
