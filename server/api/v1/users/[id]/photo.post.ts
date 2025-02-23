import { updateUser } from "server/db/users";

import { uploadFile, FileSizeError, FileTypeError, MAX_FILE_SIZE, ACCEPT_FILE_TYPES } from "shared/services/fileUpload";
import { log } from "server/utils/logger";

export default defineProtectedRouteHandler(async (event) => {
  const formData = await readFormData(event);

  if (!formData) {
    setResponseStatus(event, 201);
    return {};
  }

  const t = await useTranslation(event);

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

    await updateUser(event.context.user.id, {
      photo: path.url,
      photoThumbnail: path.url,
    });

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

    log("[user] couldn't upload photo", JSON.stringify(err));

    throw err;
  }
});
