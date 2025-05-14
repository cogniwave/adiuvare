import { addOrganization } from "server/db/organization";
import { getUserByEmail, getUserById } from "server/db/users";
import type { Organization } from "shared/types/organizations";
import { createId } from "@paralleldrive/cuid2";
import { normalizeSlug, normalizeDisplayName } from "server/utils/normalize";
import { sendEmail } from "server/services/brevo";

export const createOrganization = async (data: { name: string; ownerEmail: string }): Promise<Organization | null> => {
  const owner = await getUserByEmail(data.ownerEmail);
  if (!owner) throw new Error("Owner user not found");

  const normalizedDisplayName = normalizeDisplayName(data.name);
  const slug = normalizeSlug(normalizedDisplayName);

  const organization: Organization = {
    id: createId(),
    displayName: normalizedDisplayName,
    email: data.ownerEmail,
    password: "", // pode ser preenchido futuramente
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

  const org = await addOrganization(organization);
  return org;
};

export const addUserToOrg = async (orgId: string, email: string) => {
  // a associação real será implementada depois com a tabela de associação organizationUser
  console.log(`Mock: associar ${email} à organização ${orgId}`);
};

export async function notifyOrgOwner(ownerId: string, newUserName: string, context: "added" | "pending") {
  const owner = await getUserById(ownerId);
  if (!owner) {
    throw new Error("Organization owner not found");
  }

  let subject = "";
  let body = "";

  if (context === "added") {
    subject = "Novo membro na sua organização";
    body = `${newUserName} foi automaticamente adicionado à sua organização.`;
  } else {
    subject = "Validação pendente de novo membro";
    body = `${newUserName} solicitou entrada na sua organização. Por favor, confirme a associação.`;
  }

  await sendEmail(subject, { email: owner.email, name: owner.name }, "orgNotification", {
    greetings: "Olá",
    name: owner.name,
    body,
    buttonText: "Ver organização",
    link: `${process.env.APP_BASE_URL}/dashboard/org`,
  });
}
