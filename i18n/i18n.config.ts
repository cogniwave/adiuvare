import type { I18nOptions } from "vue-i18n";
import pt from "./locales/pt.json";
import en from "./locales/en.json";

export default {
  fallbackLocale: "pt-PT",
  locale: "pt-PT",
  legacy: false,
  messages: { "en-GB": en, "pt-PT": pt },

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
  },
} as I18nOptions;
