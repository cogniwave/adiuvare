import { getUserById } from "server/db/users";
import { sanitizeInput, desanitizeInput } from "server/utils/request";

export default defineProtectedRouteHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const id = sanitizeInput(getRouterParam(event, "id"));
  const t = await useTranslation(event);

  try {
    const user = await getUserById(id);

    if (user) {
      return {
        id: user.id,
        photo: user.photo,
        photoThumbnail: user.photoThumbnail,
        name: desanitizeInput(user.name),
        slug: desanitizeInput(user.slug),
        bio: desanitizeInput(user.bio),
        website: desanitizeInput(user.website),
        address: desanitizeInput(user.address),
        postalCode: desanitizeInput(user.postalCode),
        city: desanitizeInput(user.city),
        district: desanitizeInput(user.district),
        contacts: user.contacts
          ? user.contacts.map((c) => ({ type: c.type, contact: desanitizeInput(c.contact) }))
          : [],
      };
    }

    setResponseStatus(event, 404);
  } catch (err) {
    console.log(err);
    useBugsnag().notify({
      name: "[user] couldn't get user",
      message: JSON.stringify(err),
    });

    throw createError({ statusCode: 500, statusMessage: t("errors.unexpected") });
  }
});
