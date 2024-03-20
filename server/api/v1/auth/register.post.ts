import Joi from "joi";

import { addUser } from "~/server/db/users";
import { sendMail } from "~/server/services/mail";
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
          email: "Já existe uma conta com este email",
        },
        statusCode: 422,
        message: "Email already exists",
        statusMessage: "Validation error",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
};

export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError(error as any);
  }

  const { value, error } = Joi.object<BaseUser>({
    name: Joi.string().required().max(255).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
    }),

    password: Joi.string()
      .required()
      .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/)
      .messages({
        "string.empty": "Não pode ser vazia",
        "string.pattern.base":
          "Tem que ser entre 8-255 caracters e conter pelo menos 1 maiúscula, 1 minúscula e 1 número",
      }),

    email: Joi.string().required().email({}).messages({
      "string.empty": "Não pode ser vazio",
      "string.max": "Não pode ter mais que 255 caracteres",
      "string.email": "Não é um email válido",
    }),

    type: Joi.string().required().valid("org", "volunteer").messages({
      "string.empty": "Não pode ser vazio",
      "any.only": 'Tem que ser "org" ou "voluntário"',
    }),
  }).validate(body, { abortEarly: false, stripUnknown: true });

  if (error) {
    throw createError(error);
  }

  try {
    return await register(value);
  } catch (err: any) {
    // console.log(err);
    // throw createError(err);
  }
});
