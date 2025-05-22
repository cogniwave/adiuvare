import {
  getOrganization,
  createOrganization,
  notifyOrgOwner,
  addUserToOrg as _addUserToOrg,
} from "server/database/organizations";
import { organizations } from "server/database/schemas/organizations.schema";

export const createOrg = async (ownerId: string, name: string) => {
  const newOrg = await createOrganization({ name, ownerEmail: ownerId });
  if (!newOrg) throw new Error("Failed to create organization");
  return newOrg;
};

export const addUserToOrg = async (userId: string, orgId: string, userEmail: string, userName: string) => {
  const org = await getOrganization([[organizations.id, orgId]], {
    website: organizations.website,
    acceptSameDomainUsers: organizations.acceptSameDomainUsers,
    ownerId: organizations.ownerId,
  });

  if (!org) throw new Error("Organization not found");

  const emailDomain = userEmail.split("@")[1];
  const domainMatches = org.website && emailDomain === new URL(org.website).hostname;
  const state: "pending" | "accepted" = org.acceptSameDomainUsers && domainMatches ? "accepted" : "pending";

  await _addUserToOrg(orgId, userId, state);
  await notifyOrgOwner(org.ownerId, userName, state === "accepted" ? "added" : "pending");
};
