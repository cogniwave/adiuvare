import dayjs from "@/services/dayjs.service";

import type { NamedValue } from "@intlify/core-base";

type TranslatorFunction = (k: string, named?: NamedValue, defaultMsg?: string) => string;

export const required = (t: TranslatorFunction) => (val: string) => {
  return val?.length > 0 || t("errors.requiredField");
};

export const isEmail = (t: TranslatorFunction) => (val: string) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || t("errors.invalidEmail");
};

export const isValidPassword = (t: TranslatorFunction) => (val: string) => {
  const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/;

  return passwordPattern.test(val) || t("errors.invalidPassword");
};

export const match = (t: TranslatorFunction, valToMatch: string, key: string) => (val: string) => {
  return valToMatch === val || t("errors.mismatchKeys").replace("{0}", key);
};

export const validDate = (t: TranslatorFunction) => (val: string) => {
  const toValidate = dayjs(val, "DD/MM/YYYY");

  if (!toValidate.isValid()) {
    return t("errors.invalidDate");
  }

  const today = dayjs();

  return toValidate.isBefore(today) ? t("errors.outdatedDate") : true;
};

export const maxLength = (t: TranslatorFunction, max: number) => (val: string) => {
  return val.length < max || t("errors.max").replace("{max}", String(max));
};
