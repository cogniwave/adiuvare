import type { LoginPayload, LoginResult, RefreshResult } from "@/types/user";

const login = async (body: LoginPayload) => {
  return await $fetch<LoginResult>("/api/v1/auth/login", {
    method: "post",
    body,
  });
};

const refresh = async (refreshToken: string) => {
  return await $fetch<RefreshResult>("/api/v1/auth/refresh", {
    method: "post",
    body: { token: refreshToken },
  });
};

const logout = () => $fetch("/api/v1/auth/logout", { method: "delete" });

export default { login, logout, refresh };
