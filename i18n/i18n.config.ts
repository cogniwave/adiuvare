import pt from "./pt.json";
import en from "./en.json";

export default defineI18nConfig(() => ({
  warnHtmlInMessage: false,

  strategy: "no_prefix",

  fallbackLocale: "pt",
  locale: "pt",
  defaultLocale: "pt",

  defaultDirection: "ltr",

  messages: { en, pt },

  legacy: false,
  lazy: true,

  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root", // recommended
  },

  locales: [
    { code: "pt", iso: "pt-PT", file: "pt.json" },
    { code: "en", iso: "en-GB", file: "en.json" },
  ],

  langDir: "i18n",
}));
