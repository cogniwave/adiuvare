export const organizationUserStates = ["pending", "accepted", "rejected"] as const;

export type OrganizationUserState = (typeof organizationUserStates)[number];
