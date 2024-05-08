import type { GetOrganizationsResult, User } from "@/types/user";

export const useOrganizations = () => {
  const orgs = useState<User[]>("orgs:orgs", () => []);
  const totalOrgs = useState<number>("orgs:totalOrgs", () => 0);
  const currOrg = useState<User>("orgs:current", () => ({}) as User);

  const setOrgs = ({ organizations, total }: GetOrganizationsResult) => {
    orgs.value = organizations;
    totalOrgs.value = total;
  };

  return { orgs, currOrg, totalOrgs, setOrgs };
};
