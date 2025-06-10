import { z } from "zod/v4";
import { addressSchema, datesSchema, photosSchema } from "./common.schema";
import { contactSchema } from "./contacts.schema";
import { organizationCategories } from "../types/organization";

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string().max(264).transform(sanitizeInput),
  category: z.enum(organizationCategories),
  slug: z.string().transform(sanitizeInput),
  about: z.string().transform(sanitizeInput),
  verified: z.boolean().default(false),
  token: z.string().max(128).optional(),
  contacts: z.array(contactSchema),
  website: z.url().optional(),
  nipc: z.int().min(100000000).max(999999999).optional(),
  autoAcceptSameDomainUsers: z.boolean().optional().default(true),
  ...photosSchema.shape,
  ...addressSchema.shape,
  ...datesSchema.shape,
});

export const createOrganizationSchema = organizationSchema.pick({ name: true });
