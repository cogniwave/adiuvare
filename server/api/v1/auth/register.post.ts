import { getOrgBySlugOrName, createOrganization, addUserToOrg, notifyOrgOwner } from "server/services/orgs";
import { addUser } from "server/db/users";
import { sendEmail } from "server/services/brevo";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import { subscribeToNewsletter, type NewsletterType } from "server/services/brevo";
import Joi, { RequiredEmail, RequiredPassword, RequiredString } from "shared/validators";
import type { RegisterPayload, User, UserType } from "shared/types/user";
import type { TranslationFunction } from "shared/types";
import { log } from "server/utils/logger";
import { genToken } from "server/utils";
import { normalizeDisplayName, normalizeSlug } from "server/utils/normalize";

const register = async (payload: RegisterPayload, t: TranslationFunction): Promise<User> => {
  const token = `${genToken(32)}${Date.now()}`;

  const normalizedDisplayName = payload.organizationName ? normalizeDisplayName(payload.organizationName) : undefined;

  const normalizedSlug = normalizedDisplayName ? normalizeSlug(normalizedDisplayName) : undefined;

  const newUser = await addUser(payload, token);
  if (!newUser) {
    throw new Error("Something went wrong");
  }

  if (payload.organizationName && normalizedDisplayName && normalizedSlug) {
    const slug = normalizeSlug(normalizedDisplayName);
    const existingOrg = await getOrgBySlugOrName(slug);

    if (existingOrg) {
      const emailDomain = payload.email.split("@")[1];
      const orgDomain = existingOrg.website?.split("//")?.[1]?.split("/")?.[0];
      const domainMatches = emailDomain === orgDomain;

      if (domainMatches && existingOrg.acceptSameDomainUsers) {
        await addUserToOrg(newUser.id, existingOrg.id);
        await notifyOrgOwner(existingOrg.ownerId, payload.name, "added");
      } else {
        await notifyOrgOwner(existingOrg.ownerId, payload.name, "pending");
      }
    } else {
      const newOrg = await createOrganization({
        name: normalizedDisplayName,
        ownerEmail: payload.email,
      });

      if (!newOrg) {
        throw new Error("Organization creation failed");
      }
    }
  }

  await sendEmail(
    t("email.accountConfirm.subject"),
    { email: payload.email, name: payload.name },
    "userActionRequired",
    {
      greetings: t("email.greetings"),
      name: payload.name,
      body: t("email.accountConfirm.body"),
      body2: t("email.accountConfirm.body2"),
      buttonText: t("email.accountConfirm.buttonText"),
      alternativeLinkText: t("email.alternativeLinkText"),
      link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${payload.email}`,
    },
  );

  return newUser;
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  const body = await getValidatedInput<RegisterPayload>(event, {
    name: RequiredString.max(255),
    password: RequiredPassword,
    email: RequiredEmail,
    type: RequiredString.valid("org", "volunteer"),
    newsletter: Joi.boolean().default(false),
    organizationName: Joi.string().allow("", null).optional(),
  });

  const email = sanitizeInput(body.email);

  try {
    const user = await register(
      {
        name: sanitizeInput(body.name),
        password: body.password,
        type: sanitizeInput<UserType>(body.type),
        email,
        organizationName: body.organizationName,
      },
      t,
    );

    if (body.newsletter) {
      const newsletters: NewsletterType[] = ["newsletter"];
      if (body.type === "admin") {
        newsletters.push("orgNewsletter");
      }
      await subscribeToNewsletter(email, newsletters);
    }

    await notifyNewUser(user);

    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("UNIQUE constraint")) {
        throw createError({
          data: { email: t("errors.emailExists") },
          statusCode: 422,
          statusMessage: t("errors.validationError"),
        });
      }

      log("[user] couldn't create user", JSON.stringify(err.message));
    }

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});

export const RegisterValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  newsletter: Joi.boolean().optional(),
  organizationName: Joi.string().allow("", null).optional(),
});
