import { and, eq } from "drizzle-orm";
import { useDrizzle } from ".";
import { organizations } from "./schemas/organizations.schema";
import { genToken } from "server/utils";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import type { BaseOrganization, Organization, UpdateOrganizationPayload } from "shared/types/organizations";
import { formatFromDb as fromDb } from "./utils";

const formatFromDb = fromDb(["contacts"]);

export const getOrganization = async <T = Organization>(
  website: string,
  filter: Array<Array<SQLiteColumn | string | number | boolean>> = [],
  fields: Record<string, SQLiteColumn> = {},
): Promise<T | undefined> => {
  const result = await useDrizzle()
    .select({
      website: organizations.website,
      name: organizations.displayName,
      ...fields,
    })
    .from(organizations)
    .where(and(eq(organizations.website, website), ...filter.map(([key, value]) => eq(key as SQLiteColumn, value))))
    .limit(1);

  return result.length ? (result[0] as T) : undefined;
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

export const getOrgBySlugOrName = async (name: string) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return await getOrganization(slug, []);
};
