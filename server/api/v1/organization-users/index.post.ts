import { useDrizzle } from "~/server/db";
import { organizationUsers } from "~/server/db/schemas/organizationUsers.schema";
import { organizationUserSchema } from "~/shared/validators";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { error, value } = organizationUserSchema.validate(body);

  const db = useDrizzle();
  if (error) {
    return sendError(event, createError({ statusCode: 400, message: error.message }));
  }

  await db.insert(organizationUsers).values(value);

  return { success: true };
});
