import { getUserById } from "@/server/db/users";
import { sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const id = sanitizeInput(getRouterParam(event, "id"));

  const user = getSessionUser(event);

  const t = await useTranslation(event);

  if (!user) {
    setResponseStatus(event, 401);
    sendError(event, createError({ statusCode: 401, statusMessage: t("errors.unexpected") }));
    return;
  }

  try {
    const user = await getUserById(id);

    if (user) {
      return user;
    }

    setResponseStatus(event, 404);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[user] couldnt get user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
