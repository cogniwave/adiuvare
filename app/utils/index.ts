export const shortenText = (text: string, size: number) => {
  const result = text.trim();

  return result.length < size ? result : `${text.substring(0, size - 10)}...`;
};

/**
 * normalizes accents in words to proper search.
 * e.g.: whether user searches for "sao tome", "são tome", "são tomé", "sao tomé"
 * he'll always get the same results
 * @param {string}  str word to normalize
 * @returns {string} normalized string to use in searches
 */
export const normalize = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};
