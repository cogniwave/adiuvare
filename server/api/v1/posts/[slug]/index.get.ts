import { getPostBySlug } from "server/db/posts";
import { sanitizeInput } from "server/utils/request";
import { log } from "server/utils/logger";

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
    log("[post] couldn't get post", JSON.stringify(err));

    throw err;
  }
});
