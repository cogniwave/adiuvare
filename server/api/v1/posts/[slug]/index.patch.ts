import { updatePost } from "server/database/posts";
import { getValidatedInput, sanitizeInput } from "server/utils/request";

import type { UpdatePostPayload } from "shared/types/post";
import { updatePostSchema } from "shared/schemas/post.schema";

export default defineProtectedRouteHandler(async (event) => {
  const body = await getValidatedInput<UpdatePostPayload>(event, updatePostSchema);

  const slug = sanitizeInput(getRouterParam(event, "slug") || "");

  const result = await updatePost(
    slug,
    {
      title: sanitizeInput(body.title),
      description: sanitizeInput(body.description),
      state: sanitizeInput(body.state),
      needs: body.needs.map((n) => sanitizeInput(n)),
      locations: body.locations.map((l) => sanitizeInput(l)),
      schedule: body.schedule,
      contacts: body.contacts,
    },
    event.context.user.id,
  );

  if (result) {
    return result;
  }

  setResponseStatus(event, 404);
});
