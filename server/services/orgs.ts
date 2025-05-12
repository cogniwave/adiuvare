import { getOrganization, addOrganization } from "server/db/organization";
import { getUserByEmail } from "server/db/users";
import type { BaseOrganization } from "shared/types/organizations";
import { createId } from "@paralleldrive/cuid2";

// buscar organização por slug ou nome
export const getOrgBySlugOrName = async (name: string) => {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return await getOrganization(slug, []);
};

// criar nova organização
export const createOrganization = async (data: { name: string; ownerEmail: string }) => {
  const owner = await getUserByEmail(data.ownerEmail);
  if (!owner) throw new Error("Owner user not found");

  const baseOrg: BaseOrganization = {
    id: createId(),
    displayName: data.name,
    email: data.ownerEmail,
    password: "", // ainda não definida (talvez definida depois no primeiro login)
    ownerId: owner.id,
    acceptSameDomainUsers: true,
    category: "unknown",
    verified: owner.verified,
  };

  const org = await addOrganization(baseOrg);

  return org;
};

//  associar usuário a uma organização (mock inicial)
export const addUserToOrg = async (orgId: string, email: string) => {
  // a associação real será implementada depois com a tabela de associação user-org
  console.log(`Mock: associar ${email} à organização ${orgId}`);
};

//  notificar o dono da organização (mock)
export const notifyOrgOwner = async (ownerId: string, userName: string, status: "added" | "pending") => {
  // enviar email ou mensagem interna. por enquanto, apenas log.
  console.log(
    `Notificar dono ${ownerId}: usuário ${userName} foi ${status === "added" ? "adicionado" : "marcado como pendente"}`,
  );
};
