import { getOrgs, getTotalOrgs } from "@/server/db/users";

export default defineEventHandler(async (event) => {
  try {
    const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

    return { organizations, total };
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get organizations",
      message: JSON.stringify(err),
    });

    const t = await useTranslation(event);

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
