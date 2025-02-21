export const useMenu = () => {
  const menuOpen = useState<boolean>(() => false);

  return { menuOpen };
};
