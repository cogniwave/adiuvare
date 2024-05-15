import { put } from "@vercel/blob";

import { updateUser } from "@/server/db/users";
import { getSessionUser } from "@/server/utils/request";
import { ACCEPT_FILE_TYPES, FILE_SIZE, genToken } from "@/server/utils";

const getExtension = (mime: string) => mime.split("image/");

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);

  if (!formData) {
    setResponseStatus(event, 201);
    return {};
  }

  const id = getRouterParam(event, "id") as string;
  const user = getSessionUser(event);

  if (!user || user.id !== id) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: "errors.unexpected" }));
    return;
  }

  const file = formData.get("file") as File;

  if (file.size > FILE_SIZE) {
    throw createError({
      statusCode: 422,
      data: { file: "errors.fileTooBig" },
      statusMessage: "errors.validationError",
    });
  }

  if (!ACCEPT_FILE_TYPES.includes(file.type)) {
    throw createError({
      statusCode: 422,
      data: { file: "errors.invalidFileType " },
      statusMessage: "errors.validationError",
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

    await updateUser(user.id, { photo: path.url, photoThumbnail: path.url });

    return { photo: path.url, photoThumbnail: path.url };
  } catch (err: any) {
    if (err.statusCode === 401) {
      throw createError({ statusCode: 401, statusMessage: "errors.unexpected" });
    }

    useBugsnag().notify({
      name: "[user] couldnt upload photo",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
