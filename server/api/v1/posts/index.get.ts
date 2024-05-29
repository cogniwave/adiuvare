import { getPosts, getTotalPosts } from "@/server/db/posts";

export default defineEventHandler(async (event) => {
  try {
    const [posts, total] = await Promise.all([getPosts(), getTotalPosts()]);

    return { posts, total };
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get posts",
      message: JSON.stringify(err),
    });

    const t = await useTranslation(event);

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
