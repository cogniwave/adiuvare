import type { Organization } from "shared/types/organization";

export const useAuthContext = () => {
  const org = useState<Organization>("auth:orgs", () => ({}) as Organization);

  return { org };
};
