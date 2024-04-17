import { defineStore } from "pinia";

import type { Notification } from "@/types/notification";
import { getNotifications } from "@/services/notifications.service";

interface State {
  notifications: Notification[];
  visible: boolean;
}

export const useNotificationsStore = defineStore("notifications", {
  state: (): State => ({
    notifications: [],
    visible: false,
  }),
  getters: {
    badge(state) {
      if (state.notifications) {
        return state.notifications.length > 9 ? "9+" : String(state.notifications.length);
      }

      return "0";
    },
  },
  actions: {
    async getNotifications() {
      try {
        this.notifications = await getNotifications();
      } catch (err) {
        this.notifications = [];
      }
    },

    toggleNotifications() {
      this.visible = !this.visible;
    },
  },
});
