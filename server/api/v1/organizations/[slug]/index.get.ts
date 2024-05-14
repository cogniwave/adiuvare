import { getUserBySlug } from "@/server/db/users";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = getRouterParam(event, "slug") as string;

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

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
