import { defineProtectedRouteHandler } from "server/utils/auth";
import { getValidatedInput } from "server/utils/request";
import { addOrganizationUser } from "server/services/org-users";
import { RequiredOrgUser } from "shared/validators/org-users";
import type { OrganizationUser } from "shared/types/organizationUsers";

export default defineProtectedRouteHandler(async (event) => {
  const body = await getValidatedInput<OrganizationUser>(event, RequiredOrgUser);
  const result = await addOrganizationUser(body);
  return { success: true, result };
});
