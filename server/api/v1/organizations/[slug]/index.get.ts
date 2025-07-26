import { getOrgBySlug } from "server/database/organizations";
import { sanitizeInput } from "server/utils/request";

export default defineWrappedResponseHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));
  const org = await getOrgBySlug(slug);

  if (!org) {
    return setResponseStatus(event, 404);
  }

  return {
    id: org.id,
    photo: org.photo,
    photoThumbnail: org.photoThumbnail,
    name: desanitizeInput(org.name),
    slug: desanitizeInput(org.slug),
    about: desanitizeInput(org.about),
    website: desanitizeInput(org.website),
    address: desanitizeInput(org.address),
    postalCode: desanitizeInput(org.postalCode),
    city: desanitizeInput(org.city),
    district: desanitizeInput(org.district),
    contacts: org.contacts?.map((c) => ({ type: c.type, contact: desanitizeInput(c.contact) })) || [],
  };
});
