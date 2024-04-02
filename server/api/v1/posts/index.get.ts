import { getPosts } from "~/server/db/posts";

export default defineEventHandler(async () => {
  try {
    return await getPosts();
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
