import { and, eq, asc } from "drizzle-orm";
import { useDrizzle } from "server/db";
import { organizations } from "./schemas/organizations.schema";
import { genToken } from "server/utils";
import type { BaseOrganization, Organization, UpdateOrganizationPayload } from "shared/types/organizations";
import { formatFromDb as fromDb } from "./utils";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";

const formatFromDb = fromDb(["contacts"]);

export const getOrgs = async (
  website?: string,
  filter: Array<[SQLiteColumn, string | number | boolean]> = [],
  fields: Partial<Record<keyof Organization, SQLiteColumn>> = {},
): Promise<Organization[]> => {
  const db = useDrizzle();

  const selectedFields = {
    id: organizations.id,
    name: organizations.displayName,
    slug: organizations.slug,
    email: organizations.email,
    photo: organizations.photo,
    photoThumbnail: organizations.photoThumbnail,
    website: organizations.website,
    address: organizations.address,
    postalCode: organizations.postalCode,
    city: organizations.city,
    district: organizations.district,
    ...fields,
  };

  const baseConditions = [
    eq(organizations.category, "org"),
    eq(organizations.verified, true),
    ...(website ? [eq(organizations.website, website)] : []),
    ...filter.map(([column, value]) => eq(column, value)),
  ];

  const result = await db
    .select(selectedFields)
    .from(organizations)
    .where(and(...baseConditions))
    .orderBy(asc(organizations.displayName))
    .limit(50);

  return formatFromDb<Organization[]>(result) || [];
};

export const addOrganization = async (payload: BaseOrganization): Promise<Organization | null> => {
  const result = await useDrizzle()
    .insert(organizations)
    .values({
      email: payload.email,
      password: await hashPassword(payload.password),
      id: payload.id,
      displayName: payload.displayName,
      verified: false,
      category: payload.category,
      slug: `${payload.displayName.toLowerCase().replace(/\s+/g, "-")}-${genToken()}`,
      ownerId: payload.ownerId,
      acceptSameDomainUsers: payload.acceptSameDomainUsers ?? true,
    })
    .returning({
      id: organizations.id,
      displayName: organizations.displayName,
      verified: organizations.verified,
      category: organizations.category,
      ownerId: organizations.ownerId,
      acceptSameDomainUsers: organizations.acceptSameDomainUsers,
    });

  return result[0] as Organization;
};

export const updateOrganization = async (
  orgId: string,
  payload: UpdateOrganizationPayload,
): Promise<Organization | null> => {
  const old = await useDrizzle()
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);

  if (!old?.length) {
    return null;
  }

  return await useDrizzle()
    .update(organizations)
    .set(payload)
    .where(eq(organizations.id, orgId))
    .returning()
    .then((res) => res[0] as Organization);
};

export const getOrganizationById = async (id: string) => {
  const result = await useDrizzle()
    .select({
      id: organizations.id,
      displayname: organizations.displayName,
      slug: organizations.slug,
      acceptSameDomainUsers: organizations.acceptSameDomainUsers,
      verified: organizations.verified,
    })
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);

  return result.length === 1 ? formatFromDb<Organization>(result[0]) : null;
};

export const getOrgBySlug = async (name: string) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const org = await getOrgs(slug, []);
  return org[0];
};

export async function getTotalOrgs() {
  const db = useDrizzle();

  const result = await db.select().from(organizations);
  return result.length;
}
