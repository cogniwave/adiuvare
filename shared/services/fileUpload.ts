import { genToken } from "server/utils";

export const MAX_FILE_SIZE = 4000000;

export const ACCEPT_FILE_TYPES = ["image/png", "image/jpeg"];

interface FilePaths {
  url: string;
  thumbnailUrl: string;
}

export class FileError extends Error {}

export class FileSizeError extends FileError {}

export class FileTypeError extends FileError {}

const getExtension = (mime: string) => mime.split("image/");

export const uploadFile = async (file: File): Promise<FilePaths> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new FileSizeError();
  }

  if (!ACCEPT_FILE_TYPES.includes(file.type)) {
    throw new FileTypeError();
  }

  ensureBlob(file, { maxSize: "4MB", types: ["image"] });

  // TODO: add picture thumbimification
  const result = await hubBlob().put(`${genToken(4)}-${Date.now()}.${getExtension(file.type)}?${genToken(4)}`, file, {
    addRandomSuffix: false,
    prefix: "images",
  });

  return { url: result.pathname, thumbnailUrl: "" };
};
