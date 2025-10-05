import type { z } from "zod/v4";

import type { contactSchema } from "shared/schemas/contacts.schema";

export const entityTypes = ["organization", "user"] as const;

export type EntityType = (typeof entityTypes)[number];

export const contactTypes = ["email", "phone", "fax", "other"] as const;

export type ContactType = (typeof contactTypes)[number];

export type Contact = z.infer<typeof contactSchema>;

export type EntityContact = Pick<Contact, "id" | "contact" | "type">;
