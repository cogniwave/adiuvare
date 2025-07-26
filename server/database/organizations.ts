import { and, asc, count, eq, or } from "drizzle-orm";

import { useDrizzle } from ".";
import { organizations } from "./dbSchemas/organizations.db.schema";
import { formatFromDb as fromDb, fuzzySearch } from "./utils";
import type { Organization, OrganizationDetails } from "shared/types/organization";
import { contacts } from "./dbSchemas/contacts.db.schema";
import type { SortOrder } from "../types/common";
import { getEntityContacts } from "./contacts";

const formatFromDb = fromDb(["contacts"]);

export const searchOrgs = async (name: string, page: number) => {
  const result = await useDrizzle()
    .select({ id: organizations.id, name: organizations.name })
    .from(organizations)
    .where(or(fuzzySearch(organizations.name, name), fuzzySearch(organizations.normalizedName, name)))
    .orderBy(asc(organizations.name))
    .limit(10)
    .offset(page * 10);

  return result.map(formatFromDb<Organization[]>) || [];
};

export const getOrgs = async (page: number, _sortBy: string = "name", _sortOrder: SortOrder = "asc") => {
  const result = await useDrizzle()
    .select({
      id: organizations.id,
      name: organizations.name,
      category: organizations.category,
      slug: organizations.slug,
      about: organizations.about,
      photo: organizations.photo,
      photoThumbnail: organizations.photoThumbnail,
      city: organizations.city,
      district: organizations.district,
    })
    .from(organizations)
    .innerJoin(contacts, eq(contacts.entityId, organizations.id))
    .orderBy(asc(organizations.name))
    .offset(page * 50)
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
  const org = await useDrizzle()
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
      nipc: organizations.nipc,
    })
    .from(organizations)
    .where(and(eq(organizations.slug, slug), eq(organizations.verified, true)))
    .limit(1);

  if (!org[0]) {
    return null;
  }

  const contacts = await getEntityContacts(org[0].id, "organization");

  return { ...org[0], contacts } as OrganizationDetails;
};
