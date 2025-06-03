import { getOrgBySlug } from "server/database/users";
import { sanitizeInput } from "server/utils/request";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));
  const user = await getOrgBySlug(slug);

  if (!user) {
    return setResponseStatus(event, 404);
  }

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
    contacts: user.contacts ? user.contacts.map((c) => ({ type: c.type, contact: desanitizeInput(c.contact) })) : [],
  };
});
