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
  actions: {
    init(token: string, user: TokenUser) {
      this.token = token;
      this.user = user;

      console.log("token", token, user);
    },
  },
});
