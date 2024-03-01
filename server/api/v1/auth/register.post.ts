import Joi from "joi";
import { randomBytes } from "crypto";

import { getUser, addUser } from "~/server/db/users";
import { sendMail } from "~/server/services/mail";
import { BaseUser, DbUser, UnverifiedUser } from "~/types/user";

const sendVerificationEmail = (email: string, name: string) => {
  sendMail("Confirmação de conta", email, "foo", { name });
};

const register = async (payload: BaseUser): Promise<UnverifiedUser> => {
  const user: DbUser = await getUser(payload.email);

  if (user) {
    throw createError({ statusCode: 422, message: "Email already exists" });
  }

  const newUser = await addUser({ ...payload, token: generateRandomToken(32) });

  if (newUser) {
    sendVerificationEmail(payload.email, payload.name);
  }

  return newUser;
};

export const generateRandomToken = (length: number) => {
  return randomBytes(length).toString("hex");
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
  } catch (err) {
    console.log(err);
    throw createError(JSON.stringify(err));
  }
});
