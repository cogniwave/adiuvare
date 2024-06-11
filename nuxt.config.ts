import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { version } from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: import.meta.env.NODE_ENV === "development" },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Adiuvare",
      meta: [
        { name: "google-adsense-account", content: "ca-pub-1091633097511683" },
        { name: "msapplication-TileColor", content: "#eceff1" },
        { name: "theme-color", content: "#ECEFF1" },
      ],
      link: [
        { rel: "stylesheet", href: "https://use.fontawesome.com/releases/v5.0.13/css/brand.css" },
        { rel: "stylesheet", href: "https://use.fontawesome.com/releases/v5.0.13/css/solid.css" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },

  ssr: true,

  build: {
    transpile: ["vuetify", "jsonwebtoken"],
  },

  components: [
    { path: "~/components/layout", pathPrefix: false },
    { path: "~/components/common", pathPrefix: false },
    { path: "~/components/feed", pathPrefix: false },
    { path: "~/components/posts", pathPrefix: false },
    { path: "~/components/contacts", pathPrefix: false },
    "~/components",
  ],

  css: [
    "~/scss/styles.scss", // you should add main.scss somewhere in your app
  ],

  modules: [
    "@nuxtjs/robots",
    "@nuxtjs/eslint-module",
    "nuxt-bugsnag",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
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
    experimental: {
      localeDetector: "./i18n/localeDetector.ts",
    },
  },
});
