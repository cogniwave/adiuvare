import { z } from "zod/v4";

import { translate } from "server/utils/i18n";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/;

export const passwordSchema = z.string().regex(PASSWORD_REGEX).transform(sanitizeInput);

export const tokenSchema = z
  .string(translate("errors.invalidConfirmToken"))
  .min(32, translate("errors.invalidConfirmToken"))
  .max(50, translate("errors.invalidConfirmToken"))
  .transform(sanitizeInput);

export const emailSchema = z.email().transform(sanitizeInput);

export const datesSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const photosSchema = z.object({
  photo: z.string().optional(),
  photoThumbnail: z.string().optional(),
});

export const addressSchema = z.object({
  address: z.string().max(256).optional().transform(sanitizeInput),
  postalCode: z.string().max(8).optional().transform(sanitizeInput),
  city: z.string().max(256).optional().transform(sanitizeInput),
  district: z.string().max(128).optional().transform(sanitizeInput),
});
