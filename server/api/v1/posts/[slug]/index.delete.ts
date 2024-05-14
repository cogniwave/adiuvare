import { deletePost, getPostByOwner } from "@/server/db/posts";
import { getSessionUser } from "@/server/utils/request";

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, "id") as string;

  // delete post
  try {
    const user = await getSessionUser(event);
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

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
