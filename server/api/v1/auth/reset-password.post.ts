import Joi from "joi";

import { getUser } from "@/server/db/users";
import type { LoginPayload } from "@/types/user";
import { getValidatedInput } from "@/server/utils/request";
import type { H3Event, EventHandlerRequest } from "h3";

const sendEmail = console.log;

const sendResetEmail = async (event: H3Event<EventHandlerRequest>) => {
  const body = await getValidatedInput<LoginPayload>(event, {
    email: Joi.string().required().messages({ "strings.empty": "errors.empty" }),
  });

  const user = await getUser(body.email);

  if (user) {
    sendEmail(user.email, user.name);
  }

  return { success: true };
};

export default defineEventHandler((event) => {
  if (event.method === "GET") {
    return sendResetEmail(event);
  }
});
