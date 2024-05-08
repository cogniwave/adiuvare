import { getOrgs, getTotalOrgs } from "~/server/db/users";

export default defineEventHandler(async () => {
  try {
    const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

    return { organizations, total };
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get organizations",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: "errors.unexpected" });
  }
});
