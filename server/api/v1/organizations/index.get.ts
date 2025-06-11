import { getOrgs, getTotalOrgs } from "server/database/organizations";

export default defineEventHandler(async () => {
  const [organizations, total] = await Promise.all([getOrgs(), getTotalOrgs()]);

  return { organizations, total };
});
