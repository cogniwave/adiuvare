import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath, URL } from "url";
import { aliases } from "vuetify/iconsets/fa";
import pt from "dayjs/locale/pt";

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
  devtools: { enabled: process.env.NUXT_ENV === "development" },

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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Montserrat:wght@700&display=swap",
        },

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

  modules: [
    "@nuxtjs/i18n",
    "nuxt-auth-utils",
    "vuetify-nuxt-module",
    "@nuxthub/core",
    "@nuxt/eslint",
    "@sentry/nuxt/module",
  ],

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

  i18n: {
    restructureDir: "./i18n",
    vueI18n: "./i18n.config.ts",
    bundle: { optimizeTranslationDirective: false },
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
          // primary: buttons, links, key interactive elements
          // secondary: complementary highlights, secondary buttons, or less prominent UI features
          // accent: attention-grabbing elements (e.g., alerts, highlights, hover states).
          // surface: Cards, modals, and raised elements
          // background: Page background to provide a calming and neutral base
          // heading: Page titles, section headings, and any high-emphasis text.
          // text: Main body text for high contrast and readability.
          // subtext: Smaller, less prominent text (e.g., hints, secondary labels)
          light: {
            colors: {
              primary: "#4A90E2", //verified
              secondary: "#8E44AD", //verified
              accent: "#F5A623", //verified
              surface: "#FFFFFF", //verified
              background: "#F4F8FB", //verified
              heading: "#1C2833", //verified
              text: "#263238", //verified
              subtext: "#6D7987", //verified
              success: "#27AE60", //verified
              warning: "#F39C12", //verified
              info: "#3498DB", //verified
              error: "#E74C3C", //verified
            },
          },
          dark: {
            colors: {
              primary: "#62A8EA", //verified
              secondary: "#A569BD", //verified
              accent: "#FFB45E", //verified
              surface: "#2B303B", //verified
              background: "#1A1D23", //verified
              headings: "#FFFFFF", //verified
              text: "#E0E6ED", //verified
              subtext: "#8A94A6", //verified
              success: "#27AE60", //verified
              warning: "#F39C12", //verified
              info: "#3498DB", //verified
              error: "#E74C3C", //verified
            },
          },
        },
        defaultTheme: "light",
      },
      blueprint: {
        defaults: {
          global: {
            typography: {
              fontFamily: "Inter, sans-serif",
              h1: { fontFamily: "Montserrat, sans-serif", fontSize: "32px", fontWeight: 700 },
              h2: { fontFamily: "Montserrat, sans-serif", fontSize: "24px", fontWeight: 700 },
              body: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" }, // 1.5x line-height
              caption: { fontSize: "14px", fontWeight: 300, lineHeight: "21px" },
            },
          },
        },
      },
      defaults: {
        VCard: {
          variant: "outlined",
          class: "post",
          rounded: "xl",
          color: "text",
          background: "background",
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
        VToolbar: {
          title: {
            fontSize: "clamp(20px, 2.5vw, 32px)", // Intervalo dinâmico
          },
        },
        ssr: {
          clientWidth: 1920,
          clientHeight: 1080,
        },
        icons: {
          defaultSet: "fa",

          aliases,
          sets: "fa",
        },
      },
    },
  },

  hub: {
    analytics: false,
    blob: true,
    database: true,
    // @ts-expect-error TS complains but it's correct and it's what the docs say
    databaseMigrationsDirs: ["server/db/migrations"],
    remote: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          app: [fileURLToPath(new URL("./app", import.meta.url))],
          server: [fileURLToPath(new URL("./server", import.meta.url))],
          shared: [fileURLToPath(new URL("./shared", import.meta.url))],
          public: [fileURLToPath(new URL("./public", import.meta.url))],
        },
      },
    },
    typeCheck: true,
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: "cogniwave",
      project: "adiuvare",
    },
  },

  sourcemap: {
    client: "hidden",
  },
});
