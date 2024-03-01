export const debounce = (func: (...args: any) => void, timeout = 300) => {
  let timer: NodeJS.Timeout | null = null;

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(func, timeout);
};
