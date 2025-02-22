import { deletePost, getPostByOwner } from "server/db/posts";
import { sanitizeInput } from "server/utils/request";

export default defineProtectedRouteHandler(async (event) => {
  const postId = sanitizeInput(getRouterParam(event, "id"));

  const t = await useTranslation(event);

  // delete post
  try {
    // make sure post exists and belongs to logged in user
    const post = await getPostByOwner(postId, event.context.user.id);

    // couldn't find post, just return success
    if (!post) {
      setResponseStatus(event, 200);
      return "success";
    }

    return await deletePost(postId);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[post] couldn't delete post",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
