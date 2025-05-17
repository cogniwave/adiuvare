import Joi from "joi";
import { POST_NEEDS } from "server/db/schemas/posts.schema";
import type { PostNeed } from "../types/post";

type Types = number | boolean | string | object | Array<Types> | null | undefined;

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,255}$/;

const sanitizeArray = (arr: Types[]): Types[] => {
  return arr.map<Types>((val) => {
    if (typeof val === "number" || typeof val === "boolean" || val === null || val === undefined) {
      return val;
    }

    // array
    if (Array.isArray(val)) {
      return sanitizeArray(val);
    }

    // obj
    if (typeof val === "object") {
      return sanitizeObj(val);
    }

    return sanitizeInput<string>(val);
  });
};

const sanitizeObj = (value: Types) => {
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "object") {
    return sanitizeInput<string>(value);
  }

  return Object.entries(value).reduce<Record<string, Types>>((result, [prop, val]) => {
    // array
    if (Array.isArray(val)) {
      result[prop] = sanitizeArray(val);
    }
    // obj
    else if (typeof val === "object") {
      result[prop] = sanitizeObj(val);
    }
    // str
    else if (typeof val === "string") {
      result[prop] = sanitizeInput<string>(val);
    }
    // anything else
    else {
      result[prop] = sanitizeInput<string>(val);
    }

    return result;
  }, {});
};

const joi = Joi.defaults((schema) => {
  schema = schema.messages({
    "string.empty": "errors.joi.required",
    "string.max": "errors.joi.max",
    "string.email": "errors.joi.invalidEmail",
    "string.valid": "errors.invalidField",

    "array.min": "errors.joi.required",

    "any.required": "errors.joi.required",
    "any.only": "errors.joi.only",
  });

  if (schema.type === "string") {
    return schema.custom((value) => sanitizeInput<string>(value));
  }

  if (schema.type === "object") {
    return schema.custom(sanitizeObj);
  }

  if (schema.type === "array") {
    return schema.custom(sanitizeArray);
  }

  return schema;
});

export const OptionalString = joi.string().optional().allow(null, "");

export const RequiredString = joi.string().required().min(1);

export const RequiredArray = Joi.array().required().min(1);

export const RequiredObject = Joi.object().required();

export const OptionalEmail = Joi.string().email({ maxDomainSegments: 10 });

export const RequiredEmail = OptionalEmail.required().min(1);

export const OptionalPassword = Joi.string().pattern(PASSWORD_REGEX);

export const RequiredPassword = OptionalPassword.required().min(1);

export const RequiredContacts: Joi.ArraySchema<UserContact[]> = RequiredArray.items(
  Joi.object().keys({
    type: Joi.string().valid("phone", "other", "email").required(),
    contact: Joi.string().min(5).max(264).required(),
  }),
).custom((value: UserContact[]) => {
  return value.map((c) => ({ type: c.type, contact: sanitizeInput(c.contact) }));
});

export const RequiredNeeds: Joi.ArraySchema<PostNeed[]> = RequiredArray.items(Joi.string().valid(...POST_NEEDS)).custom(
  (value: PostNeed[]) => value.map(sanitizeInput),
);

// export default (t: TranslationFunction) =>
//   Joi.defaults((schema) => {
//     schema.messages({
//       "string.empty": t("errors.joi.required"),
//       "string.max": t("errors.joi.max"),
//       "string.email": t("errors.joi.invalidEmail"),
//       "array.min": t("errors.joi.required"),
//       "any.required": t("errors.joi.required"),
//       "any.only": t("errors.joi.only"),
//     });

//     if (schema.type === "string") {
//       return schema.custom((value) => sanitizeInput<string>(value));
//     }

//     if (schema.type === "object") {
//       return schema.custom(sanitizeObj);
//     }

//     if (schema.type === "array") {
//       return schema.custom(sanitizeArray);
//     }

//     return schema;
//   });

export default joi;
