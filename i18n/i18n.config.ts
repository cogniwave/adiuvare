import pt from "./pt.json";
import en from "./en.json";

console.log("config");
export default defineI18nConfig(() => ({
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
}));
