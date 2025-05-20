import { getOrgBySlug } from "server/db/organizations";
import { sanitizeInput } from "server/utils/request";
import { log } from "server/utils/logger";

export default defineEventHandler(async (event) => {
  // never really undefined because this handler is only triggered if it exists
  const slug = sanitizeInput(getRouterParam(event, "slug"));

  try {
    const org = await getOrgBySlug(slug);

    if (org) {
      return {
        id: org.id,
        photo: org.photo,
        photoThumbnail: org.photoThumbnail,
        name: desanitizeInput(org.displayName),
        slug: desanitizeInput(org.slug),
        website: desanitizeInput(org.website),
        address: desanitizeInput(org.address),
        postalCode: desanitizeInput(org.postalCode),
        city: desanitizeInput(org.city),
        district: desanitizeInput(org.district),
      };
    }

    setResponseStatus(event, 404);
  } catch (err) {
    log("[org] couldn't get organization", JSON.stringify(err));

    throw err;
  }
});
