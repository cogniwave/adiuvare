import pt from "./pt.json";
import en from "./en.json";

export default defineI18nConfig(() => ({
  warnHtmlInMessage: false,

  strategy: "no_prefix",

  fallbackLocale: "pt-PT",
  locale: "pt-PT",
  defaultLocale: "pt-PT",

  defaultDirection: "ltr",

  messages: { "en-GB": en, "pt-PT": pt },

  legacy: false,
  lazy: true,

  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root", // recommended
  },

  locales: [
    { code: "pt-PT", iso: "pt-PT", file: "pt.json" },
    { code: "en-GB", iso: "en-GB", file: "en.json" },
  ],

  langDir: "./i18n",

  datetimeFormats: {
    "pt-PT": {
      short: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      long: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      },
    },
    "en-GB": {
      short: {
        year: "numeric",
        month: "short",
        day: "2-digit",
      },
      long: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      },
    },
    "en-US": {
      short: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
      long: {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      },
    },
  },
  numberFormats: {
    "pt-PT": {
      currency: {
        style: "currency",
        currency: "EUR",
      },
      decimal: {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    "en-GB": {
      currency: {
        style: "currency",
        currency: "GBP",
      },
      decimal: {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    "en-US": {
      currency: {
        style: "currency",
        currency: "USD",
      },
      decimal: {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
}));
