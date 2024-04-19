import type { User, BaseUser } from "@/types/user";

export const register = async (body: BaseUser) => {
  return await $fetch<User>("/api/v1/auth/register", {
    method: "post",
    body,
  });
};

export const resetPassword = async (email: string) => {
  return $fetch("/api/v1/auth/reset-password", {
    body: { email },
  });
};

export const logout = () => $fetch("/api/v1/auth/logout");

export const confirmAccount = (token: string) => {
  return $fetch("/api/v1/auth/confirm", { method: "post", body: { token } });
};
