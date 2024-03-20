import { defineStore } from "pinia";

type NotifyType = "success" | "error" | "warning";

interface NotifyState {
  text: string;
  visible: boolean;
  timeout: number;
  type: NotifyType;
}

const DEFAULT_TIMEOUT = 5000;

export const useNotifyStore = defineStore("notify", {
  state: (): NotifyState => ({
    text: "",
    visible: false,
    timeout: DEFAULT_TIMEOUT,
    type: "success",
  }),
  actions: {
    notify(text: string, type: NotifyType, timeout: number = DEFAULT_TIMEOUT) {
      this.visible = true;
      this.text = text;
      this.type = type;
      this.timeout = timeout;
    },

    notifyError(text: string, timeout: number = DEFAULT_TIMEOUT) {
      this.notify(text, "error", timeout);
    },

    notifySuccess(text: string, timeout: number = DEFAULT_TIMEOUT) {
      this.notify(text, "success", timeout);
    },

    notifyWarning(text: string, timeout: number = DEFAULT_TIMEOUT) {
      this.notify(text, "warning", timeout);
    },
  },
});
