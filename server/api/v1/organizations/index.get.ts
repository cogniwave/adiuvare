import { z } from "zod/v4";
import { getOrgs, getTotalOrgs, searchOrgs } from "server/database/organizations";
import { paginationSchema } from "server/schemas/common.schema";
import { validateEvent } from "~~/server/utils/request";

const schema = z.object({
  origin: z.enum(["registration", "orgs"]),
  name: z.string().optional(),
  ...paginationSchema.shape,
});

export default defineWrappedResponseHandler(async (event) => {
  const { name, page, source } = await validateEvent(event, schema);

  if (source === "registration") {
    return name ? await searchOrgs(name, page!) : [];
  }

  const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

  return { organizations, total };
});
