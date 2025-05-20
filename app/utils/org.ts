import type { User } from "shared/types/user";

export const userBelongsToOrg = (user: User | null | undefined): boolean => {
  return user?.organizationUser?.state === "accepted";
};
