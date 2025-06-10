import type { GetListResult } from "shared/types/request";
import type { Organization } from "shared/types/organization";

export const useOrganizations = () => {
  const orgs = useState<Organization[]>("orgs:orgs", () => []);
  const totalOrgs = useState<number>("orgs:totalOrgs", () => 0);
  const currOrg = useState<Organization>("orgs:current", () => ({}) as Organization);

  const setOrg = (org: Organization | null) => (currOrg.value = org as Organization);

  const setOrgs = ({ data, total }: GetListResult<Organization>) => {
    orgs.value = data;
    totalOrgs.value = total;
  };

  return { orgs, currOrg, totalOrgs, setOrgs, setOrg };
};
