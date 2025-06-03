import { getPostBySlug } from "server/database/posts";
import { sanitizeInput } from "server/utils/request";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));
  const post = await getPostBySlug(slug);

  if (post) {
    return post;
  }

  setResponseStatus(event, 404);
});
