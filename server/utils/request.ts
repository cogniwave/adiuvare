import Joi from "joi";
import type { H3Event, EventHandlerRequest, H3Error } from "h3";

// make this a separate function to call on functions where we need to get current logged user
// this could be a middleware but we wouldn't use it in every request so it'd be wasted time
export const getSessionUser = (event: H3Event<EventHandlerRequest>) => {
  const user = validateToken(event);

  if (!user) {
    return null;
  }

  return user;
};

export const getValidatedInput = async <T>(event: H3Event<EventHandlerRequest>, schema: Joi.PartialSchemaMap) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error: unknown) {
    throw createError(error as H3Error);
  }

  const { value, error } = Joi.object<T>(schema).validate(body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw createError({
      data: error.details.map((d) => d.message),
      message: "Invalid params",
      statusCode: 422,
    });
  }

  return value;
};

export const sanitizeInput = <R = string>(input?: string | null): R => {
  if (!input) {
    return "" as R;
  }

  input = input.toString().trim();

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/gi, (match: string) => map[match]!) as R;
};

export const desanitizeInput = (input?: string | null) => {
  if (!input) {
    return "";
  }

  input = input.toString().trim();

  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  return input.replace(/(&amp;)|(&lt;)|(&gt;)|(&quot)|(&#x27;)|(&#x2F;)/gi, (match: string) => map[match]!);
};
