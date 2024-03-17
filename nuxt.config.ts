import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { version } from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: true,

  build: {
    transpile: ["vuetify", "jsonwebtoken"],
  },

  css: [
    "~/scss/styles.scss", // you should add main.scss somewhere in your app
  ],

  modules: [
    "@nuxtjs/robots",
    "@pinia/nuxt",
    "@nuxtjs/eslint-module",
    "nuxt-bugsnag",
    "@sidebase/nuxt-auth",
    // @ts-expect-error for some reason this starts raising error with @sidebase/next-auth
    (_, nuxt) => {
      // @ts-expect-error same here
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

  auth: {
    provider: { type: "refresh" },
    baseURL: "/api/v1/auth",
    endpoints: {
      signIn: { path: "/login", method: "post" },
      signOut: { path: "/logout", method: "post" },
      signUp: { path: "/register", method: "post" },
      getSession: { path: "/session", method: "get" },
      refresh: { path: "/refresh", method: "post" },
    },
    pages: {
      login: "/login",
      register: "/login",
    },
    sessionDataType: {
      email: "string",
      name: "string",
      type: "volunteer | org",
    },
    token: {
      maxAgeInSeconds: 60 * 5, // 5 min
    },
    enableRefreshOnWindowFocus: true,
    enableRefreshPeriodically: 60000,
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
});
