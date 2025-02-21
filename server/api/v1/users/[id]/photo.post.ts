import { updateUser } from "@/server/db/users";
import { getSessionUser, sanitizeInput } from "@/server/utils/request";
import { isNuxtError } from "nuxt/app";
import {
  uploadFile,
  FileSizeError,
  FileTypeError,
  MAX_FILE_SIZE,
  ACCEPT_FILE_TYPES,
} from "~/server/services/fileUpload";

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  if (!formData) {
    setResponseStatus(event, 201);
    return {};
  }

  const id = sanitizeInput(getRouterParam(event, "id") || "");
  const user = getSessionUser(event);

  const t = await useTranslation(event);

  if (!user || user.id !== id) {
    setResponseStatus(event, 401);
    sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "unauthorized",
        message: t("errors.unauthenticated"),
      }),
    );
    return;
  }

  const file = formData.get("file") as File;

  if (file.size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 422,
      data: { file: t("errors.fileTooBig") },
      statusMessage: t("errors.validationError"),
    });
  }

  if (!ACCEPT_FILE_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 422,
      data: { file: t("errors.invalidFileType") },
      statusMessage: t("errors.validationError"),
    });
  }

  // TODO: delete previous picture if it exists

  try {
    const path = await uploadFile(file);

    await updateUser(user.id, [
      { field: "photo", value: path.url },
      { field: "photoThumbnail", value: path.url },
    ]);

    return { photo: path.url, photoThumbnail: path.url };
  } catch (err: unknown) {
    if (err instanceof FileSizeError) {
      createError({
        statusCode: 422,
        data: { file: t("errors.fileTooBig") },
        statusMessage: t("errors.validationError"),
      });
    }

    if (err instanceof FileTypeError) {
      throw createError({
        statusCode: 422,
        data: { file: t("errors.invalidFileType") },
        statusMessage: t("errors.validationError"),
      });
    }

    if (isNuxtError(err) && err.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "unauthorized",
        message: t("errors.unauthenticated"),
      });
    }

    useBugsnag().notify({
      name: "[user] couldn't upload photo",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
