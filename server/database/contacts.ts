import type { EntityContact, EntityType } from "~~/shared/types/contact";
import { and, eq, useDrizzle } from ".";
import { contacts } from "./dbSchemas/contacts.db.schema";

export const getEntityContacts = async (entityId: string, entityType: EntityType): Promise<EntityContact[]> => {
  return (await useDrizzle()
    .select({ id: contacts.id, type: contacts.type, contact: contacts.contact })
    .from(contacts)
    .where(and(eq(contacts.entityId, entityId), eq(contacts.entityType, entityType)))) as EntityContact[];
};
