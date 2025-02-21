import type { Notification } from "~~/shared/types/notification";

export const getNotifications = () => {
  return $fetch<Notification[]>("/api/v1/notifications", { method: "get" });
};
