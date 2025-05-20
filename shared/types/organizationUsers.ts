export type OrgUserState = "pending" | "accepted" | "rejected";


export interface OrganizationUser {
  userId: string;
  orgId: string;
  state: OrgUserState;
  reason?: string;
}
