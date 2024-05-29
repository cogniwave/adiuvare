import { getUserBySlug } from "@/server/db/users";
import { sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));

  try {
    const post = await getUserBySlug(slug);

    if (post) {
      return post;
    }

    setResponseStatus(event, 404);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[organization] couldnt get user",
      message: JSON.stringify(err),
    });

    const t = await useTranslation(event);

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
