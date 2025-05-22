import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { createPost } from "server/database/posts";
import { genToken } from "server/utils";
import { notifyNewPost } from "server/services/slack";
import { log } from "server/utils/logger";

import Joi, { RequiredArray, RequiredContacts, RequiredNeeds, RequiredString } from "shared/validators";
import type { CreatePostPayload } from "shared/types/post";
import { PostScheduleRule } from "shared/validators/posts";

export default defineProtectedRouteHandler(async (event) => {
  const body = await getValidatedInput<CreatePostPayload>(event, {
    title: RequiredString,
    description: RequiredString,
    needs: RequiredNeeds,
    locations: RequiredArray.items(Joi.string()).custom((value) => value.map(sanitizeInput)),
    schedule: PostScheduleRule,
    contacts: RequiredContacts,
  });

  // validate and add token to event
  try {
    const result = await createPost({
      title: sanitizeInput(body.title),
      description: sanitizeInput(body.description),
      needs: body.needs,
      locations: body.locations,
      schedule: body.schedule,
      contacts: body.contacts,
      createdUserId: event.context.user.id,
      slug: `${body.title.trim().slice(0, 20).replaceAll(" ", "_")}-${genToken(10)}`,
    });

    await notifyNewPost({ id: result.id, createdBy: event.context.user.id, title: event.context.user.id });

    return { ...result, createdBy: event.context.user.slug, logo: event.context.user.logo };
  } catch (err) {
    log("[posts]: couldn't create post", JSON.stringify(err));

    throw err;
  }
});
