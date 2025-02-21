type NotifyType = "success" | "error" | "warning" | "info";

const DEFAULT_TIMEOUT = 5000;

export const useNotify = () => {
  const text = useState(() => "");
  const visible = useState(() => false);
  const timeout = useState(() => DEFAULT_TIMEOUT);
  const type = useState(() => "success");

  const _notify = (_text: string, _type: NotifyType, _timeout: number = DEFAULT_TIMEOUT) => {
    visible.value = true;
    text.value = _text;
    type.value = _type;
    timeout.value = _timeout;
  };

  const notifyError = (text: string, timeout: number = DEFAULT_TIMEOUT) => {
    _notify(text, "error", timeout);
  };

  const notifySuccess = (text: string, timeout: number = DEFAULT_TIMEOUT) => {
    _notify(text, "success", timeout);
  };

  const notifyWarning = (text: string, timeout: number = DEFAULT_TIMEOUT) => {
    _notify(text, "warning", timeout);
  };

  const notifyInfo = (text: string, timeout: number = DEFAULT_TIMEOUT) => {
    _notify(text, "info", timeout);
  };

  return { notifyInfo, notifyError, notifySuccess, notifyWarning, text, visible, timeout, type };
};
