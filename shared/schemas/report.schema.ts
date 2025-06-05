import { z } from "zod/v4";

import { postSchema } from "./post.schema";

export const reportSchema = z.object({
  id: z.string(),
  post: postSchema,
  reason: z.string().transform(sanitizeInput),
  user: z.string().transform(sanitizeInput),
  createdAt: z.date(),
});

export const createReportSchema = reportSchema.omit({ id: true, createdAt: true });
