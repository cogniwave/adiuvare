import { deletePost, getPostByOwner } from "server/database/posts";
import { sanitizeInput } from "server/utils/request";
import { log } from "server/utils/logger";

export default defineProtectedRouteHandler(async (event) => {
  const postId = sanitizeInput(getRouterParam(event, "id"));

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
    log("[post] couldn't delete post", JSON.stringify(err));

    throw err;
  }
});
