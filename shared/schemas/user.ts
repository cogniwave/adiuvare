import { z } from "zod/v4";
import { sanitizeInput } from "server/utils/request";
import { contactsSchema, emailSchema, passwordSchema } from "shared/validators";

export const newUserSchema = z.object({
  name: z.string().max(255).transform(sanitizeInput),
  password: passwordSchema.transform(sanitizeInput),
  email: z.email().transform(sanitizeInput),
  newsletter: z.boolean().default(false),
});

export const updateProfileSchema = z.object({
  name: z.string().transform(sanitizeInput),
  slug: z.string().transform(sanitizeInput),
  bio: z.string().optional().transform(sanitizeInput),
  website: z.string().max(256).optional().transform(sanitizeInput),
  address: z.string().max(256).optional().transform(sanitizeInput),
  postalCode: z.string().max(8).optional().transform(sanitizeInput),
  city: z.string().max(256).optional().transform(sanitizeInput),
  district: z.string().max(128).optional().transform(sanitizeInput),
  contacts: contactsSchema,
});

export const updateAccountSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  bio: z.string().optional().transform(sanitizeInput),
  website: z.string().max(256).optional().transform(sanitizeInput),
  address: z.string().max(256).optional().transform(sanitizeInput),
  postalCode: z.string().max(8).optional().transform(sanitizeInput),
  city: z.string().max(256).optional().transform(sanitizeInput),
  district: z.string().max(128).optional().transform(sanitizeInput),
  contacts: contactsSchema,
});
