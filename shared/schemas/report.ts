import { z } from "zod/v4";
import { postSchema } from "./post";

export const reportSchema = z.object({
  post: postSchema,
  reason: z.string().transform(sanitizeInput),
  user: z.string().transform(sanitizeInput),
});
