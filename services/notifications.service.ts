import type { Notification } from "@/types/notification";

export const getNotifications = () => {
  return $fetch<Notification[]>("/api/v1/notifications", { method: "get" });
};
