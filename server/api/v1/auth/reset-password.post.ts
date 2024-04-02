import Joi from "joi";

import { getUser } from "~/server/db/users";
import { LoginPayload } from "~/types/user";

const sendEmail = console.log;

const sendResetEmail = async (body: any) => {
  const { value: payload, error } = Joi.object<LoginPayload>({
    email: Joi.string()
      .required()
      .messages({ "strings.empty": "errors.empty" }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError(error);
  }

  const user = await getUser(payload.email);

  if (user) {
    sendEmail(user.email, user.name);
  }

  return { success: true };
};

export default defineEventHandler((event) => {
  if (event.method === "GET") {
    return sendResetEmail(event.toJSON());
  }
});
