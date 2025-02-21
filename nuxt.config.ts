import { defineNuxtConfig } from "nuxt/config";
import { version } from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-21",

  future: { compatibilityVersion: 4 },

  devtools: { enabled: process.env.NODE_ENV === "development" },

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
        { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/favicon/apple-touch-icon.png" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/assets/favicon/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/assets/favicon/favicon-16x16.png",
        },
        { rel: "manifest", href: "/assets/favicon/site.webmanifest" },
        { rel: "mask-icon", href: "/assets/favicon/safari-pinned-tab.svg", color: "#5bbad5" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      brevoConversationId: process.env.BREVO_CONVO_ID,
      baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
  },

  ssr: true,

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  build: {
    transpile: ["vuetify", "vue-i18n"],
  },

  css: [
    "~/scss/styles.scss", // you should add main.scss somewhere in your app
  ],

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-auth-utils",
    "vuetify-nuxt-module",
    "@nuxthub/core",
    "@vueuse/nuxt",
    "nuxt-bugsnag",
  ],

  vite: {
    css: {
      preprocessorOptions: {
        sass: { api: "modern-compiler" },
      },
    },
  },

  bugsnag: {
    publishRelease: true,
    disableLog: false,
    baseUrl: process.env.APP_BASE_URL,

    config: {
      releaseStage: process.env.NODE_ENV,
      apiKey: process.env.BUGSNAG_KEY!,
      enabledReleaseStages: ["staging", "production"],
      appVersion: version,
    },
  },

  i18n: {
    restructureDir: "./app/i18n",
    vueI18n: "./i18n.config.ts",

    experimental: {
      localeDetector: "./localeDetector.ts",
    },
  },

  vuetify: {
    moduleOptions: {
      // styles: { configFile: '/settings.scss' }
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
      },
      date: {
        adapter: "dayjs",
        // locale: { en: enGB, pt },
      },
      defaults: {
        VTextField: {
          density: "comfortable",
          flat: true,
        },
        VForm: {
          "validate-on": "input lazy",
        },
        VBtn: {
          flat: true,
        },
      },
    },
  },
});
