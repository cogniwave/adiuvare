import { z } from "zod/v4";
import { addressSchema, contactsSchema, datesSchema, passwordSchema, photosSchema } from "./common.schema";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().max(264).transform(sanitizeInput),
  email: z.email(),
  password: passwordSchema,
  type: z.enum(["admin", "user"]),
  slug: z.string().transform(sanitizeInput),
  verified: z.boolean(),
  token: z.string().max(128).optional().transform(sanitizeInput),
  contacts: contactsSchema,
  bio: z.string().optional().transform(sanitizeInput),
  ...photosSchema.shape,
  ...addressSchema.shape,
  ...datesSchema.shape,
});

export const createUserSchema = userSchema.pick({ name: true, email: true, password: true });
