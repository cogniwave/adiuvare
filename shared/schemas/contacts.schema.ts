import { z } from "zod/v4";
import { contactTypes, entityTypes } from "shared/types/contact";
import { datesSchema } from "./common.schema";

export const contactSchema = z.object({
  id: z.string(),
  entityId: z.string(),
  entityType: z.enum(entityTypes),
  contact: z.string().transform(sanitizeInput),
  type: z.enum(contactTypes),
  ...datesSchema.shape,
});

export const createContactSchema = contactSchema.omit({ id: true, createdAt: true, updatedAt: true });
