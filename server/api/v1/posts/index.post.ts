import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { createPost } from "server/db/posts";
import { genToken } from "server/utils";
import { notifyNewPost } from "server/services/slack";
import { log } from "server/utils/logger";

import Joi, {
  RequiredArray,
  RequiredContacts,
  RequiredNeeds,
  RequiredObject,
  RequiredString,
} from "shared/joi/validators";
import type { CreatePostPayload, ScheduleType } from "shared/types/post";

export default defineProtectedRouteHandler(async (event) => {
  const body = await getValidatedInput<CreatePostPayload>(event, {
    title: RequiredString,
    description: RequiredString,
    needs: RequiredNeeds,
    locations: RequiredArray.items(Joi.string()),
    schedule: RequiredObject,
    contacts: RequiredContacts,
  });

  // validate and add token to event
  try {
    const scheduleType: ScheduleType = sanitizeInput(body.schedule.type);

    const result = await createPost({
      title: sanitizeInput(body.title),
      description: sanitizeInput(body.description),
      needs: body.needs.map((n) => sanitizeInput(n)),
      locations: body.locations.map((l) => sanitizeInput(l)),
      schedule: {
        type: scheduleType,
        ...(scheduleType !== "anytime" && { payload: body.schedule.payload }),
      },
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
