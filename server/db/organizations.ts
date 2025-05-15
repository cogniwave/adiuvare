import { and, eq } from "drizzle-orm";
import { useDrizzle } from "server/db";
import { createId } from "@paralleldrive/cuid2";
import { organizations } from "./schemas/organizations.schema";
import { genToken } from "server/utils";
import type { BaseOrganization, Organization, UpdateOrganizationPayload } from "shared/types/organizations";
import { formatEntityOfDb } from "server/db/utils";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { getUserByEmail, getUserById } from "server/db/users";
import { organizationUsers } from "./schemas/organizationsUsers.schema";

import { normalizeSlug, normalizeDisplayName } from "server/utils/normalize";
import { sendEmail } from "server/services/brevo";

const formatOrgOfDb = formatEntityOfDb<Organization>(["contacts"]);

export const getOrganization = async (
  filter: Array<[SQLiteColumn, string | number | boolean]> = [],
  fields: Partial<Record<keyof Organization, SQLiteColumn>> = {},
): Promise<Organization | null> => {
  const db = useDrizzle();

  const selectedFields = {
    id: organizations.id,
    name: organizations.displayName,
    slug: organizations.slug,
    photo: organizations.photo,
    photoThumbnail: organizations.photoThumbnail,
    website: organizations.website,
    address: organizations.address,
    postalCode: organizations.postalCode,
    city: organizations.city,
    district: organizations.district,
    acceptSameDomainUsers: organizations.acceptSameDomainUsers,
    ownerId: organizations.ownerId,
    ...fields,
  };

  const baseConditions = [eq(organizations.verified, true), ...filter.map(([col, val]) => eq(col, val))];

  const result = await db
    .select(selectedFields)
    .from(organizations)
    .where(and(...baseConditions))
    .limit(1);

  return result.length ? formatOrgOfDb(result[0]) : null;
};

export const addOrganization = async (payload: BaseOrganization): Promise<Organization | null> => {
  const result = await useDrizzle()
    .insert(organizations)
    .values({
      id: payload.id,
      displayName: payload.displayName,
      verified: false,
      category: payload.category,
      slug: `${payload.displayName.toLowerCase().replace(/\s+/g, "-")}-${genToken()}`,
      ownerId: payload.ownerId,
      acceptSameDomainUsers: payload.acceptSameDomainUsers ?? true,
    })
    .returning();

  return result.length ? (formatOrgOfDb(result[0]) as Organization) : null;
};

export const updateOrganization = async (
  orgId: string,
  payload: UpdateOrganizationPayload,
): Promise<Organization | null> => {
  const db = useDrizzle();
  const result = await db.update(organizations).set(payload).where(eq(organizations.id, orgId)).returning();

  return result.length ? (formatOrgOfDb(result[0]) as Organization) : null;
};

export const getOrganizationById = async (id: string) => {
  return await getOrganization([[organizations.id, id]]);
};

/* export const getOrgBySlug = async (slugInput: string): Promise<Organization | null> => {
  const slug = normalizeSlug(slugInput);
  return await getOrganization([[organizations.slug, slug]]);
}; */

export const getTotalOrgs = async () => {
  const result = await useDrizzle().select().from(organizations);
  return result.length;
};

export const createOrganization = async (data: { name: string; ownerEmail: string }): Promise<Organization | null> => {
  const owner = await getUserByEmail(data.ownerEmail);
  if (!owner) throw new Error("Owner user not found");

  const normalizedDisplayName = normalizeDisplayName(data.name);
  const slug = normalizeSlug(normalizedDisplayName);

  const organization: Organization = {
    id: createId(),
    displayName: normalizedDisplayName,
    ownerId: owner.id,
    verified: owner.verified,
    category: "unknown",
    slug,
    acceptSameDomainUsers: true,
    nipc: undefined,
    token: undefined,
    about: undefined,
    website: undefined,
    address: undefined,
    postalCode: undefined,
    city: undefined,
    district: undefined,
    photo: undefined,
    photoThumbnail: undefined,
  };

  return await addOrganization(organization);
};

export const addUserToOrg = async (orgId: string, userId: string, state: "accepted" | "pending", reason?: string) => {
  const db = useDrizzle();

  await db.insert(organizationUsers).values({
    orgId,
    userId,
    state,
    reason,
  });

  console.log(`Usuário ${userId} associado à organização ${orgId} com estado ${state}`);
};

export const notifyOrgOwner = async (ownerId: string, newUserName: string, context: "added" | "pending") => {
  const owner = await getUserById(ownerId);
  if (!owner) throw new Error("Organization owner not found");

  const subject = context === "added" ? "Novo membro na sua organização" : "Validação pendente de novo membro";
  const body =
    context === "added"
      ? `${newUserName} foi automaticamente adicionado à sua organização.`
      : `${newUserName} solicitou entrada na sua organização. Por favor, confirme a associação.`;

  await sendEmail(subject, { email: owner.email, name: owner.name }, "orgNotification", {
    greetings: "Olá",
    name: owner.name,
    body,
    buttonText: "Ver organização",
    link: `${process.env.APP_BASE_URL}/dashboard/org`,
  });
};
