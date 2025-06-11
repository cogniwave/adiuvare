import type { Organization } from "shared/types/organization";

export const useAuthContext = () => {
  const org = useState<Organization | null>("auth:orgs", () => null);
  const canCreatePost = computed<boolean>(() => !!org.value);

  return { org, canCreatePost };
};
