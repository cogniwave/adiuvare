import { and, asc, count, eq } from "drizzle-orm";

import { useDrizzle } from ".";
import { organizations } from "./dbSchemas/organizations.db.schema";
import { contactsGrouping, formatFromDb as fromDb } from "./utils";
import type { Organization } from "shared/types/organization";
import { contacts } from "./dbSchemas/contacts.db.schema";

const formatFromDb = fromDb(["contacts"]);

export const getOrgs = async () => {
  const result = await useDrizzle()
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      about: organizations.about,
      photo: organizations.photo,
      photoThumbnail: organizations.photoThumbnail,
      website: organizations.website,
      address: organizations.address,
      postalCode: organizations.postalCode,
      city: organizations.city,
      district: organizations.district,
      contacts: contacts,
    })
    .from(organizations)
    .innerJoin(contacts, eq(contacts.entityId, organizations.id))
    .orderBy(asc(organizations.name))
    .limit(50);

  return formatFromDb<Organization[]>(result) || [];
};

export const getTotalOrgs = async () => {
  const result = await useDrizzle().select({ total: count() }).from(organizations);

  try {
    return result[0]!.total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const getOrgBySlug = async (slug: string) => {
  const result = await useDrizzle()
    .select({
      id: organizations.id,
      name: organizations.name,
      about: organizations.about,
      slug: organizations.slug,
      photo: organizations.photo,
      photoThumbnail: organizations.photoThumbnail,
      website: organizations.website,
      address: organizations.address,
      postalCode: organizations.postalCode,
      city: organizations.city,
      district: organizations.district,
      contacts: contactsGrouping(),
    })
    .from(organizations)
    .innerJoin(contacts, eq(contacts.entityId, organizations.id))
    .where(and(eq(organizations.slug, slug), eq(organizations.verified, true)))
    .limit(1);

  return result.length === 1 ? formatFromDb<Organization>(result[0]) : null;
};
