import { getOrgs, getTotalOrgs } from "server/db/users";

export default defineEventHandler(async (event) => {
  try {
    const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

    return {
      organizations: organizations.map((org) => {
        return {
          id: org.id,
          photo: org.photo,
          photoThumbnail: org.photoThumbnail,
          name: desanitizeInput(org.name),
          slug: desanitizeInput(org.slug),
          bio: desanitizeInput(org.bio),
          // todo: these should only be fetched when checking org details
          // no need to send over data that is not used
          website: desanitizeInput(org.website),
          address: desanitizeInput(org.address),
          postalCode: desanitizeInput(org.postalCode),
          city: desanitizeInput(org.city),
          district: desanitizeInput(org.district),
          contacts: org.contacts
            ? org.contacts.map((c) => ({ type: c.type, contact: desanitizeInput(c.contact) }))
            : [],
        };
      }),
      total,
    };
  } catch (err) {
    useBugsnag().notify({
      name: "failed to get organizations",
      message: JSON.stringify(err),
    });

    const t = await useTranslation(event);

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
