import { getOrgs, getTotalOrgs } from "server/db/organization";
import { log } from "server/utils/logger";

export default defineEventHandler(async () => {
  try {
    const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

    return {
      organizations: organizations.map((org) => {
        return {
          id: org.id,
          photo: org.photo,
          photoThumbnail: org.photoThumbnail,
          name: desanitizeInput(org.displayName),
          slug: desanitizeInput(org.slug),
          // todo: these should only be fetched when checking org details
          // no need to send over data that is not used
          website: desanitizeInput(org.website),
          address: desanitizeInput(org.address),
          postalCode: desanitizeInput(org.postalCode),
          city: desanitizeInput(org.city),
          district: desanitizeInput(org.district),
          /* contacts: org.contacts
            ? org.contacts.map((c) => ({ type: c.type, contact: desanitizeInput(c.contact) }))
            : [], */
        };
      }),
      total,
    };
  } catch (err) {
    log("[organizations]: failed to get organizations", JSON.stringify(err));

    throw err;
  }
});
