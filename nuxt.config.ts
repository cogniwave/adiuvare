import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath, URL } from "url";
import { aliases } from "vuetify/iconsets/fa";
import { blueGrey } from "vuetify/util/colors";
import pt from "dayjs/locale/pt";

import { version } from "./package.json";

const alias = {
  app: fileURLToPath(new URL("./app", import.meta.url)),
  server: fileURLToPath(new URL("./server", import.meta.url)),
  shared: fileURLToPath(new URL("./shared", import.meta.url)),
  public: fileURLToPath(new URL("./public", import.meta.url)),
};

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
        { rel: "stylesheet", href: "https://use.fontawesome.com/releases/v6.7.2/css/brand.css" },
        { rel: "stylesheet", href: "https://use.fontawesome.com/releases/v6.7.2/css/solid.css" },
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
    experimental: { openAPI: true },
  },

  build: {
    transpile: ["vuetify", "vue-i18n"],
  },

  components: [
    { path: "~/components/layout", pathPrefix: false },
    { path: "~/components/common", pathPrefix: false },
    { path: "~/components/feed", pathPrefix: false },
    { path: "~/components/posts", pathPrefix: false },
    { path: "~/components/contacts", pathPrefix: false },
    { path: "~/components/organizations", pathPrefix: false },
    "~/components",
  ],

  css: ["./app/scss/styles.scss", "vuetify/styles", "@fortawesome/fontawesome-free/css/all.css"],

  modules: ["@nuxtjs/i18n", "@nuxt/image", "nuxt-auth-utils", "vuetify-nuxt-module", "@nuxthub/core", "nuxt-bugsnag"],

  features: { inlineStyles: false },

  vite: {
    resolve: { alias },

    css: {
      preprocessorOptions: {
        sass: { api: "modern-compiler" },
      },
    },
  },

  alias,

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
      date: {
        adapter: "dayjs",
        locale: { pt },
      },
      theme: {
        themes: {
          light: {
            colors: {
              primary: blueGrey.base, // #607D8B
              accent: blueGrey.darken4, // #263238
              surface: "#f7f7f7",
              background: blueGrey.lighten5, // #ECEFF1
              text: blueGrey.darken4, // #263238
            },
          },
        },
        defaultTheme: "light",
      },
      defaults: {
        VCard: {
          variant: "outlined",
          class: "post",
          rounded: "xl",
          color: blueGrey.darken4,
          background: "#f7f7f7",
        },
        VIcon: {
          size: "x-small",
        },
        VTextField: {
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          validateOn: "blur",
          variant: "underlined",
        },
        VTextarea: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
        },
        VAutocomplete: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          autoGrow: true,
          autoSelectFirst: true,
        },
        VSelect: {
          variant: "underlined",
          density: "compact",
          class: "pl-0 pr-0",
          rounded: "4px",
          hideDetails: "auto",
          hideHint: true,
        },
        VTooltip: {
          location: "top",
        },
      },
      ssr: {
        clientWidth: 1920,
        clientHeight: 1080,
      },
      icons: {
        defaultSet: "fa",
        // @ts-ignore
        aliases,
        sets: "fa",
      },
    },
  },

  hub: {
    analytics: true,
    blob: true,
    database: true,
  },
});
