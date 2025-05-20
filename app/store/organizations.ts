import type { GetOrganizationsResult, Organization, OrganizationContacts } from "shared/types/organizations";

export const useOrganizations = () => {
  const orgs = useState<Organization[]>("orgs:orgs", () => []);
  const totalOrgs = useState<number>("orgs:totalOrgs", () => 0);
  const currOrg = useState<OrganizationContacts | null>("orgs:current", () => null);
  const setOrg = (org: OrganizationContacts | null) => (currOrg.value = org as OrganizationContacts);

  const setOrgs = ({ organizations, total }: GetOrganizationsResult) => {
    orgs.value = organizations;
    totalOrgs.value = total;
  };

  return { orgs, currOrg, totalOrgs, setOrgs, setOrg };
};
