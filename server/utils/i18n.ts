import { createI18n } from "vue-i18n";
import config from "../../i18n/i18n.config";

const i18n = createI18n<false, typeof config>(config);

export const translate = (key: string, params: Record<string, string> = {}) => {
  return i18n.global.t(key, params);
};
