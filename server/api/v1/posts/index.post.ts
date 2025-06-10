import { nanoid } from "nanoid";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { createPost } from "server/database/posts";
import { notifyNewPost } from "server/services/slack";

import type { CreatePostPayload } from "shared/types/post";
import { createPostSchema } from "shared/schemas/post.schema";

export default defineProtectedRouteHandler(async (event) => {
  const body = await getValidatedInput<CreatePostPayload>(event, createPostSchema);

  const result = await createPost({
    title: sanitizeInput(body.title),
    description: sanitizeInput(body.description),
    needs: body.needs,
    locations: body.locations,
    schedule: body.schedule,
    contacts: body.contacts,
    createdUserId: event.context.user.id,
    slug: `${body.title.trim().slice(0, 20).replaceAll(" ", "_")}-${nanoid(10)}`,
  });

  notifyNewPost({ id: result.id, createdBy: event.context.user.id, title: event.context.user.id });

  return { ...result, createdBy: event.context.user.id };
});
