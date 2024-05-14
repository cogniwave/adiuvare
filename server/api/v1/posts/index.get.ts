import { getPosts, getTotalPosts } from "@/server/db/posts";

export default defineEventHandler(async () => {
  try {
    const [posts, total] = await Promise.all([getPosts(), getTotalPosts()]);

    return { posts, total };
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
