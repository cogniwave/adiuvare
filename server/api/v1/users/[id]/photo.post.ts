import { put } from "@vercel/blob";

import { updateUser } from "@/server/db/users";
import { getSessionUser, sanitizeInput } from "@/server/utils/request";
import { ACCEPT_FILE_TYPES, FILE_SIZE, genToken } from "@/server/utils";

const getExtension = (mime: string) => mime.split("image/");

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  if (!formData) {
    setResponseStatus(event, 201);
    return {};
  }

  const id = sanitizeInput(getRouterParam(event, "id"));
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

  if (file.size > FILE_SIZE) {
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

  // TODO: add picture thumbimification
  // TODO: delete previous picture if it exists

  try {
    const path = await put(
      `${genToken(4)}-${Date.now()}.${getExtension(file.type)}?${genToken(4)}`,
      file,
      { access: "public" },
    );

    await updateUser(user.id, [
      { field: "photo", value: path.url },
      { field: "photoThumbnail", value: path.url },
    ]);

    return { photo: path.url, photoThumbnail: path.url };
  } catch (err: any) {
    if (err.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "unauthorized",
        message: t("errors.unauthenticated"),
      });
    }

    useBugsnag().notify({
      name: "[user] couldnt upload photo",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
