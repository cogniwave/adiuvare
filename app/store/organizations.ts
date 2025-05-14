import type { GetOrganizationsResult, Organization } from "shared/types/organizations";

export const useOrganizations = () => {
  const orgs = useState<Organization[]>("orgs:orgs", () => []);
  const totalOrgs = useState<number>("orgs:totalOrgs", () => 0);
  const currOrg = useState<Organization>("orgs:current", () => ({}) as Organization);

  const setOrg = (org: Organization | null) => (currOrg.value = org as Organization);

  const setOrgs = ({ organizations, total }: GetOrganizationsResult) => {
    orgs.value = organizations;
    totalOrgs.value = total;
  };

  return { orgs, currOrg, totalOrgs, setOrgs, setOrg };
};
