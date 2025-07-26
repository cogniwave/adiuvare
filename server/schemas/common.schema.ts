import { z } from "zod/v4";

export const paginationSchema = z.object({
  page: z.int().positive().optional().default(0),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
