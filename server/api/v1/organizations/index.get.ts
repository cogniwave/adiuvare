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
  const { name, source, page, sortBy, sortOrder } = await validateEvent(event, schema);

  if (source === "registration") {
    return name ? await searchOrgs(name, page!) : [];
  }

  const [data, total] = await Promise.all([getOrgs(page, sortBy, sortOrder), getTotalOrgs()]);
  return { data, total };
});
