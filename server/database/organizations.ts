import { and, asc, count, eq, or } from "drizzle-orm";

import { useDrizzle } from ".";
import { organizations } from "./dbSchemas/organizations.db.schema";
import { contactsGrouping, formatFromDb as fromDb, fuzzySearch } from "./utils";
import type { Organization } from "shared/types/organization";
import { contacts } from "./dbSchemas/contacts.db.schema";

const formatFromDb = fromDb(["contacts"]);

export const searchOrgs = async (name: string, page: number) => {
  const result = await useDrizzle()
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(or(fuzzySearch(organizations.name, name), fuzzySearch(organizations.normalized_name, name)))
    .orderBy(asc(organizations.name))
    .limit(10)
    .offset(page * 10);

  return result.map(formatFromDb<Organization[]>) || [];
};

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

  return result.map(formatFromDb<Organization[]>) || [];
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
