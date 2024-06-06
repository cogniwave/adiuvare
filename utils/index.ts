export const FEED_PAGE_SIZE = 30;

export const debounce = (func: (...args: any) => void, timeout = 300) => {
  let timer: NodeJS.Timeout | null = null;

  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(func, timeout);
};

export const shortenText = (text: string, size: number) => {
  const result = text.trim();

  return result.length < size ? result : `${text.substring(0, size - 10)}...`;
};
