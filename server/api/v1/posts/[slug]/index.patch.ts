import { updatePost } from "server/db/posts";
import { POST_STATES } from "server/db/schemas/posts.schema";
import { getValidatedInput, sanitizeInput } from "server/utils/request";

import { ScheduleType } from "shared/types/post";
import type { UpdatePostPayload } from "shared/types/post";
import Joi, { RequiredNeeds, RequiredArray, RequiredContacts, RequiredString } from "shared/validators";
import { log } from "server/utils/logger";
import { PostScheduleRule } from "shared/validators/posts";

export default defineProtectedRouteHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<UpdatePostPayload>(event, {
    title: RequiredString,
    state: RequiredString.valid(POST_STATES),
    description: RequiredString,
    needs: RequiredNeeds,
    locations: RequiredArray.items(Joi.string()),
    schedule: PostScheduleRule,
    contacts: RequiredContacts,
  });

  const slug = sanitizeInput(getRouterParam(event, "slug") || "");

  try {
    const result = await updatePost(
      slug,
      {
        title: sanitizeInput(body.title),
        description: sanitizeInput(body.description),
        state: sanitizeInput(body.state),
        needs: body.needs.map((n) => sanitizeInput(n)),
        locations: body.locations.map((l) => sanitizeInput(l)),
        schedule: {
          type: body.schedule.type,
          ...(body.schedule.type !== ScheduleType.ANYTIME && {
            payload: (body.schedule as PostSchedule<typeof body.schedule.type>).payload,
          }),
        },
        contacts: body.contacts,
      },
      event.context.user.id,
    );

    if (result) {
      return result;
    }

    sendError(event, createError({ statusCode: 500, statusMessage: t("errors.unexpected") }));
  } catch (err: unknown) {
    log("[post] couldn't delete post", JSON.stringify(err));

    throw err;
  }
});
