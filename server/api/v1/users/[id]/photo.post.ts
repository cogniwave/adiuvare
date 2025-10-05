import { updateUser } from "server/database/users";

import { translate } from "server/utils/i18n";
import { uploadFile, FileSizeError, FileTypeError, MAX_FILE_SIZE, ACCEPT_FILE_TYPES } from "shared/services/fileUpload";

export default defineProtectedRouteHandler(async (event) => {
  const formData = await readFormData(event);

  if (!formData) {
    setResponseStatus(event, 201);
    return {};
  }

  const file = formData.get("file") as File;

  if (file.size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 422,
      data: { file: translate("errors.fileTooBig") },
      statusMessage: "Unprocessable Content",
    });
  }

  if (!ACCEPT_FILE_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 422,
      data: { file: translate("errors.invalidFileType") },
      statusMessage: "Unprocessable Content",
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
        data: { file: translate("errors.fileTooBig") },
        statusMessage: "Unprocessable Content",
      });
    }

    if (err instanceof FileTypeError) {
      throw createError({
        statusCode: 422,
        data: { file: translate("errors.invalidFileType") },
        statusMessage: "Unprocessable Content",
      });
    }

    throw err;
  }
});
