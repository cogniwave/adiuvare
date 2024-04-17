import { defineStore } from "pinia";

import type { TokenUser } from "@/types/user";

interface SessionState {
  user: TokenUser;
  token: string;
}

export const useSessionStore = defineStore("session", {
  state: (): SessionState => ({
    user: {} as TokenUser,
    token: "",
  }),
  getters: {
    isOrg: (state) => state.user.type === "org",
  },
  actions: {
    init(token: string, user: TokenUser) {
      this.token = token;
      this.user = user;
    },
  },
});
