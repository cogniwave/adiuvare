import { getOrganization, createOrganization, notifyOrgOwner } from "server/db/organizations";
import { organizations } from "server/db/schemas/organizations.schema";
import { addUser } from "server/db/users";
import { sendEmail } from "server/services/brevo";
import { sanitizeInput, getValidatedInput } from "server/utils/request";
import { notifyNewUser } from "server/services/slack";
import Joi, { RequiredEmail, RequiredPassword, RequiredString } from "shared/validators";
import type { RegisterPayload, User, UserType } from "shared/types/user";

import { translate } from "server/utils/i18n";
import { log } from "server/utils/logger";
import { genToken } from "server/utils";
import { normalizeDisplayName, normalizeSlug } from "server/utils/normalize";
import { addUserToOrg as _addUserToOrg } from "server/api/v1/organizations/common";

const register = async (payload: RegisterPayload): Promise<User> => {
  const token = `${genToken(32)}${Date.now()}`;
  const normalizedDisplayName = payload.name ? normalizeDisplayName(payload.name) : undefined;
  const normalizedSlug = normalizedDisplayName ? normalizeSlug(normalizedDisplayName) : undefined;

  const newUser = await addUser(payload, token);
  if (!newUser) throw new Error("Something went wrong");

  if (payload.name && normalizedDisplayName && normalizedSlug) {
    const existingOrg = await getOrganization([[organizations.slug, normalizedSlug]]);

    if (existingOrg) {
      const emailDomain = payload.email.split("@")[1];
      const orgDomain = existingOrg.website?.split("//")?.[1]?.split("/")?.[0];
      const domainMatches = emailDomain === orgDomain;

      if (domainMatches && existingOrg.acceptSameDomainUsers) {
        await _addUserToOrg(newUser.id, existingOrg.id, payload.email, payload.name);
        await notifyOrgOwner(existingOrg.ownerId, payload.name, "added");
      } else {
        await _addUserToOrg(newUser.id, existingOrg.id, payload.email, payload.name);
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
    translate("email.accountConfirm.subject"),
    { email: payload.email, name: payload.name },
    "userActionRequired",
    {
      greetings: translate("email.greetings"),
      name: payload.name,
      body: translate("email.accountConfirm.body"),
      body2: translate("email.accountConfirm.body2"),
      buttonText: translate("email.accountConfirm.buttonText"),
      alternativeLinkText: translate("email.alternativeLinkText"),
      link: `${process.env.APP_BASE_URL}/confirmation?token=${token}&email=${payload.email}`,
    },
  );

  return newUser;
};

export default defineEventHandler(async (event) => {
  const body = await getValidatedInput<RegisterPayload>(event, {
    name: RequiredString.max(255),
    password: RequiredPassword,
    email: RequiredEmail,
    type: RequiredString.valid("org", "volunteer"),
    newsletter: Joi.boolean().default(false),
    orgName: Joi.string().allow("", null).optional(),
  });

  const email = sanitizeInput(body.email);

  try {
    const user = await register({
      name: sanitizeInput(body.name),
      password: body.password,
      type: sanitizeInput<UserType>(body.type),
      email,
      orgName: sanitizeInput(body.orgName),
    });

    await notifyNewUser(user);
    return user;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes("UNIQUE constraint")) {
        throw createError({
          data: {
            email: translate("errors.emailExists"),
          },
          statusCode: 422,
          statusMessage: translate("errors.validationError"),
        });
      }

      log("[user] couldn't create user", JSON.stringify(err.message));
    }

    throw createError({
      statusCode: 500,
      statusMessage: translate("errors.unexpected"),
    });
  }
});
