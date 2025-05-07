import type { PartialSchemaMap } from "joi";
import type { H3Error, EventHandler, EventHandlerRequest, H3Event } from "h3";

import Joi from "shared/validators";
import { ValidationError, type Errors } from "shared/exceptions";

export const getValidatedInput = async <T>(event: H3Event<EventHandlerRequest>, schema: PartialSchemaMap) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error: unknown) {
    throw createError(error as H3Error);
  }

  const { value, error } = Joi.object<T>(schema).validate(body, {
    abortEarly: false,
    stripUnknown: true,
    externals: true,
  });

  if (error) {
    const t = await useTranslation(event);

    const errors: Errors = {};
    error.details.forEach(({ context, path, message }) => {
      errors[path[0]!] = t(message, context || {});
    });

    throw new ValidationError(errors);
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

const errorHandling = async <T extends EventHandlerRequest>(event: H3Event<T>, error: unknown) => {
  createApp();

  const t = await useTranslation(event);

  if (process.env.NUXT_ENV === "development") {
    console.error(error);
  }

  // Handle specific errors
  if (error instanceof ValidationError) {
    throw createError({
      status: 422,
      statusMessage: "Unprocessable content",
      cause: t("errors.validationError"),
      data: error.toError(),
    });
  }

  if (isH3Error(error)) {
    if (error.statusCode === 401) {
      throw createError({ ...error, status: 401, cause: t("errors.authRequired") });
    }

    if (error.statusCode === 403) {
      throw createError({ ...error, status: 403, cause: t("errors.noPermissions") });
    }

    throw error;
  }

  throw createError({ status: 500 });
};

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>,
): EventHandler<T, D> => {
  return defineEventHandler<T>(async (event) => {
    try {
      return await handler(event);
    } catch (error: unknown) {
      await errorHandling<T>(event, error);
    }
  });
};

export const defineProtectedRouteHandler = <T extends EventHandlerRequest, D>(handler: EventHandler<T, D>) => {
  return defineEventHandler<T>(async (event) => {
    try {
      event.context.user = (await requireUserSession(event)).user;

      return await handler(event);
    } catch (error) {
      await errorHandling<T>(event, error);
    }
  });
};
