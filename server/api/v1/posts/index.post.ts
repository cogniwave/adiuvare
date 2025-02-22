import Joi, {
  RequiredArray,
  RequiredContacts,
  RequiredNeeds,
  RequiredObject,
  RequiredString,
} from "shared/joi/validators";

import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { createPost } from "server/db/posts";
import { genToken } from "server/utils";
import { notifyNewPost } from "server/services/slack";

import type { CreatePostPayload, ScheduleType } from "shared/types/post";

export default defineProtectedRouteHandler(async (event) => {
  const t = await useTranslation(event);

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
    console.log(err);
    useBugsnag().notify({
      name: "couldn't create post",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
