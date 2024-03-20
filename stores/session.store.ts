import { defineStore } from "pinia";

interface UserState {}

export const useSessionStore = defineStore("session", {
  state: (): UserState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
  }),
  actions: {},
});
