import { deletePost, getPostByOwner } from "server/db/posts";
import { sanitizeInput, getSessionUser } from "server/utils/request";

export default defineEventHandler(async (event) => {
  const postId = sanitizeInput(getRouterParam(event, "id"));

  const t = await useTranslation(event);

  // delete post
  try {
    const user = getSessionUser(event);

    if (!user) {
      setResponseStatus(event, 401);
      sendError(
        event,
        createError({
          statusCode: 401,
          statusMessage: "unauthorized",
          message: t("errors.unauthenticated"),
        }),
      );
      return;
    }

    // make sure post exists and belongs to logged in user
    const post = await getPostByOwner(postId, user.id);

    // couldn't find post, just return success
    if (!post) {
      setResponseStatus(event, 200);
      return "success";
    }

    return await deletePost(postId);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[post] couldnt delete post",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
