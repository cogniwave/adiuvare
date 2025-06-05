import { z } from "zod/v4";
import { organizationUserStates } from "shared/types/userOrganizations";

export const organizationUserSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  state: z.enum(organizationUserStates),
  isOwner: z.boolean().optional().default(false),
  reason: z.string().optional().transform(sanitizeInput),
  createdAt: z.date(),
});

export const createOrganizationUserSchema = organizationUserSchema.omit({ reason: true, createdAt: true });
