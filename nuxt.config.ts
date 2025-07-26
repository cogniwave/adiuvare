import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath, URL } from "url";
import pt from "dayjs/locale/pt";
import enGB from "dayjs/locale/en-gb";

const alias = {
  app: fileURLToPath(new URL("./app", import.meta.url)),
  server: fileURLToPath(new URL("./server", import.meta.url)),
  shared: fileURLToPath(new URL("./shared", import.meta.url)),
  public: fileURLToPath(new URL("./public", import.meta.url)),
};

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // base configs
  compatibilityDate: "2025-03-01",
  future: { compatibilityVersion: 4 },

  devtools: { enabled: process.env.NODE_ENV === "development" },
  // debug: process.env.NODE_ENV === "development",

  ssr: true,
  sourcemap: { server: "hidden", client: "hidden" },

  experimental: { viewTransition: true, lazyHydration: true },
  features: { inlineStyles: false },
  typescript: { typeCheck: true },
  css: ["app/assets/scss/styles.scss"],

  imports: {
    scan: false,
    dirs: [],
  },

  // build related configs
  nitro: {
    compressPublicAssets: true,
    experimental: { openAPI: true, tasks: true },
  },

  runtimeConfig: {
    public: {
      brevoConversationId: process.env.BREVO_CONVO_ID,
      baseAssetUrl: process.env.BASE_ASSET_URL,
      baseUrl,
    },
  },

  build: {
    transpile: ["vuetify", "vue-i18n"],
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
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

  vite: {
    resolve: { alias },

    css: {
      preprocessorOptions: {
        scss: {
          // api: "modern-compiler",
          // additionalData: '@use "@/assets/scss/variables.scss";',
        },
      },
    },
  },

  alias,

  // module related configs
  modules: [
    "@nuxtjs/i18n",
    "nuxt-auth-utils",
    "vuetify-nuxt-module",
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "dayjs-nuxt",
    "nuxt-security",
    "nuxt-lazyload-files",
  ],

  // fucking dependencies not updating as they should
  // unhead update (which is used by nuxt) broke vuetify styling injection
  // this fixes it, but it's a temporary thing until vuetify nuxt module is updated
  // https://github.com/vuetifyjs/nuxt-module/issues/298#issuecomment-2708812122
  unhead: {
    legacy: true,
    renderSSRHeadOptions: { omitLineBreaks: false },
  },

  hub: {
    analytics: true,
    blob: true,
    database: true,
    workers: true,
    bindings: {
      compatibilityFlags: ["nodejs_compat_v2"],
      observability: { logs: true },
    },
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    langDir: "./locales",
    defaultLocale: "pt-PT",

    locales: [
      { code: "pt-PT", iso: "pt-PT", file: "pt.json", name: "Português" },
      { code: "en-GB", iso: "en-GB", file: "en.json", name: "English" },
    ],

    baseUrl,
  },

  googleFonts: {
    families: { Inter: ["400", "300"], Montserrat: ["700"] },
  },

  image: {
    quality: 100,
    loading: "lazy",
    domains: ["*"],
    provider: "custom",

    providers: {
      custom: { provider: "app/providers/custom-provider.ts" },
    },
  },

  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: { cookieName: "adtheme" },
      },
      styles: { configFile: "assets/scss/vuetify.scss" },
    },
    vuetifyOptions: {
      date: {
        adapter: "dayjs",
        locale: { en: enGB, pt },
      },
      ssr: { clientWidth: 1920, clientHeight: 1080 },
      icons: {
        defaultSet: "fa-svg",
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
              primary: "#4A90E2",
              secondary: "#8E44AD",
              accent: "#F5A623",
              surface: "#FFFFFF",
              background: "#F4F8FB",
              heading: "#1C2833",
              text: "#263238",
              subtext: "#6D7987",
              success: "#27AE60",
              warning: "#F39C12",
              info: "#3498DB",
              error: "#E74C3C",
            },
          },
          dark: {
            colors: {
              primary: "#62A8EA",
              secondary: "#A569BD",
              accent: "#FFB45E",
              surface: "#2B303B",
              background: "#1A1D23",
              heading: "#FFFFFF",
              text: "#E0E6ED",
              subtext: "#8A94A6",
              success: "#27AE60",
              warning: "#F39C12",
              info: "#3498DB",
              error: "#E74C3C",
            },
          },
        },
        defaultTheme: "light",
      },
      defaults: {
        global: {
          density: "comfortable",
        },
        VListItem: {
          activeColor: "accent",
        },
        VCard: {
          background: "background",
          rounded: "xl",
        },
        VIcon: {
          size: "x-small",
        },
        VTextField: {
          density: "comfortable",
          hideDetails: "auto",
          validateOn: "blur",
          variant: "underlined",
          rounded: "lx",
          flat: true,
        },
        VTextarea: {
          variant: "underlined",
          density: "compact",
          hideDetails: "auto",
          autoGrow: true,
        },
        VAutocomplete: {
          variant: "underlined",
          density: "compact",
          hideDetails: "auto",
          autoGrow: true,
          autoSelectFirst: true,
        },
        VSelect: {
          variant: "underlined",
          density: "compact",
          hideDetails: "auto",
          hideHint: true,
        },
        VTooltip: {
          location: "top",
        },
        VBtn: {
          color: "primary",
          flat: true,
          rounded: "lg",
        },
        VCheckbox: {
          falseIcon: "fa-solid fa-square",
        },
      },
    },
  },

  dayjs: {
    locales: ["en", "pt"],
    plugins: ["relativeTime", "utc", "timezone", "localizedFormat"],
    defaultLocale: "pt",
    defaultTimezone: "Europe/Lisbon",
  },

  lazyLoadFiles: {
    files: {
      css: [
        {
          filePath: "app/assets/scss/mobile.scss",
          windowWidthLessThan: { width: 767 },
        },
      ],
    },
  },
});
