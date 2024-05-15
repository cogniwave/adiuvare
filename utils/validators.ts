import { isPossiblePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import type { NamedValue } from "@intlify/core-base";

import dayjs from "@/services/dayjs.service";
import { FILE_SIZE, ACCEPT_FILE_TYPES } from "@/server/utils";

type TranslatorFunction = (k: string, named?: NamedValue, defaultMsg?: string) => string;

export const required = (t: TranslatorFunction) => (val: string) => {
  return val?.length > 0 || t("errors.requiredField");
};

export const isValidEmail = (t: TranslatorFunction) => (val: string) => {
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
  return dayjs(val, "DD/MM/YYYY").isValid() || t("errors.invalidDate");
};

export const futureDate = (t: TranslatorFunction) => (val: string) => {
  return dayjs(val, "DD/MM/YYYY").isBefore(dayjs()) ? t("errors.outdatedDate") : true;
};

export const maxLength = (t: TranslatorFunction, max: number) => (val: string) => {
  return val.length < max || t("errors.max").replace("{max}", String(max));
};

export const isValidPhone = (t: TranslatorFunction) => (val: string) => {
  return (
    (isPossiblePhoneNumber(val, "PT") && isValidPhoneNumber(val, "PT")) || t("errors.invalidPhone")
  );
};

export const fileType = (t: TranslatorFunction) => (val: File) => {
  return ACCEPT_FILE_TYPES.includes(val.type) || t("errors.invalidFileType");
};

export const fileSize = (t: TranslatorFunction) => (val: File) => {
  return !val || val.size < FILE_SIZE || t("errors.fileLarge");
};
