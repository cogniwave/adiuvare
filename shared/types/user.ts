import type { z } from "zod/v4";

import type { updateAccountSchema, updateProfileSchema, userSchema } from "shared/schemas/user.schema";

export type UserType = "user" | "admin";

export type User = z.infer<typeof userSchema>;

export type TokenUser = Pick<User, "id" | "name" | "email" | "slug">;

export type GetAuthUserResult = TokenUser & Pick<User, "password" | "verified">;

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type UpdateAccountPayload = z.infer<typeof updateAccountSchema>;

export type UpdateTokenPayload = Pick<User, "token">;

export interface UpdatePhotoPayload {
  photo?: string;
  photoThumbnail?: string;
}
