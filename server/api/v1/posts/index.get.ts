import { getPosts, getTotalPosts } from "~/server/db/posts";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    return await (query.total ? getTotalPosts() : getPosts());
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get posts",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: "errors.unexpected",
    });
  }
});
