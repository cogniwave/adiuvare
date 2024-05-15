import type { Notification } from "@/types/notification";

export const useNotifications = () => {
  const notifications = useState<Notification[]>(() => []);
  const visible = useState(() => false);

  const badge = computed(() => {
    if (notifications.value) {
      return notifications.value.length > 9 ? "9+" : String(notifications.value.length);
    }

    return "0";
  });

  return { notifications, visible, badge };
};
