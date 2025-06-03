import { z } from "zod/v4";

import { translate } from "server/utils/i18n";
import type { UserContact } from "shared/types/user";

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/;

export const passwordSchema = z.string().regex(PASSWORD_REGEX).transform(sanitizeInput);

export const contactsSchema = z
  .array(
    z.object({
      type: z.enum(["phone", "other", "email"]),
      contact: z.string().min(5).max(264),
    }),
  )
  .transform<UserContact[]>((value) => {
    return value.map((c) => ({ type: c.type, contact: sanitizeInput(c.contact) }));
  });

export const tokenSchema = z
  .string(translate("errors.invalidConfirmToken"))
  .min(32, translate("errors.invalidConfirmToken"))
  .max(50, translate("errors.invalidConfirmToken"))
  .transform(sanitizeInput);

export const emailSchema = z.email().transform(sanitizeInput);
