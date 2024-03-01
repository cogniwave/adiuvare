import { getPosts } from "~/server/db/posts";

export default defineEventHandler(async (event) => {
  console.log("user", event.user);

  try {
    return await getPosts();
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get posts",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong on our side",
    });
  }
});
