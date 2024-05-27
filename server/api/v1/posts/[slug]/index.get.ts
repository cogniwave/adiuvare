import { getPostBySlug } from "@/server/db/posts";
import { sanitizeInput } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));

  try {
    const post = await getPostBySlug(slug);

    if (post) {
      return post;
    }

    setResponseStatus(event, 404);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[post] couldnt get post",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
