export const genToken = (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
};

export const genImgHash = () => {};

export const FILE_SIZE: number = 1024 * 1024 * 5; // 4MB

export const ACCEPT_FILE_TYPES = ["image/png", "image/jpeg"];
