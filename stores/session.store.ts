import { defineStore } from "pinia";

import type { User } from "@/types/user";

import { logout } from "@/services/user.service";

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const useSessionStore = defineStore("session", {
  state: (): UserState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },

    async logout() {
      await logout();
      this.clearUser();
    },

    clearUser() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
    },

    setToken(access: string, refresh: string) {
      this.accessToken = access;
      this.refreshToken = refresh;

      localStorage.setItem("tokens", JSON.stringify({ access, refresh }));
    },
  },
});
