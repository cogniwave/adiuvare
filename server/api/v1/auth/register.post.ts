import Joi from "joi";

import { addUser } from "~/server/db/users";
import { sendMail } from "~/server/services/mail";
import { getValidatedInput } from "~/server/utils/request";
import type { BaseUser, User } from "~/types/user";
import type { DrizzleError } from "~/server/types/drizzle";

const sendVerificationEmail = (email: string, name: string) => {
  sendMail("Confirmação de conta", email, "foo", { name });
};

const register = async (payload: BaseUser): Promise<User> => {
  try {
    const newUser = await addUser(payload);

    if (!newUser) {
      throw Error("Something went wrong");
    }

    sendVerificationEmail(payload.email, payload.name);
    return newUser;
  } catch (err: DrizzleError) {
    if (err.constraint === "users_email_unique") {
      throw createError({
        data: {
          email: "errors.emailExists",
        },
        statusCode: 422,
        message: "Email already exists",
        statusMessage: "Validation error",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "errors.unexpected",
    });
  }
};

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<BaseUser>(event, {
    name: Joi.string().required().max(255).messages({
      "string.empty": "errors.empty",
      "string.max": "errors.max_255",
    }),

    password: Joi.string()
      .required()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.empty": "errors.empty",
        "string.pattern.base": "errors.invalidPassword",
      }),

    email: Joi.string().required().email({}).messages({
      "string.empty": "errors.empty",
      "string.max": "errors.max_255",
      "string.email": "errors.invalidEmail",
    }),

    type: Joi.string().required().valid("org", "volunteer").messages({
      "string.empty": "errors.empty",
      "any.only": "errors.invalidUserType",
    }),
  });

  try {
    return await register(body);
  } catch (err: any) {
    // console.log(err);
    // throw createError(err);
  }
});
