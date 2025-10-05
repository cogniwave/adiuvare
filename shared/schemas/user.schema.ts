import { z } from "zod/v4";

import { addressSchema, datesSchema, passwordSchema, photosSchema } from "./common.schema";
import { contactSchema } from "./contacts.schema";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().max(264).transform(sanitizeInput),
  email: z.email(),
  password: passwordSchema,
  type: z.enum(["admin", "user"]),
  slug: z.string().transform(sanitizeInput),
  verified: z.boolean(),
  token: z.string().max(128).optional().transform(sanitizeInput),
  contacts: z.array(contactSchema),
  bio: z.string().optional().transform(sanitizeInput),
  ...photosSchema.shape,
  ...addressSchema.shape,
  ...datesSchema.shape,
});

export const createUserSchema = userSchema.pick({ name: true, email: true, password: true });

export const loginSchema = userSchema.pick({ email: true, password: true });

export const updateProfileSchema = userSchema.pick({
  name: true,
  slug: true,
  bio: true,
  address: true,
  city: true,
  district: true,
  postalCode: true,
  contacts: true,
});

export const updateAccountSchema = userSchema.pick({
  email: true,
  password: true,
});
