import { z } from "zod/v4";

import { sortOrder } from "../types/common";

export const paginationSchema = z.object({
  page: z.int().positive().optional().default(0),
  sortBy: z.string().optional(),
  sortOrder: z.enum(sortOrder).optional(),
});
