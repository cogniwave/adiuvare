import { z } from "zod/v4";
import { sanitizeInput } from "server/utils/request";
import { contactsSchema } from "shared/validators";
import { postScheduleSchema, postNeedsSchema } from "shared/validators/posts";
import { postStates } from "../types/post";

export const createPostSchema = z.object({
  description: z.string(),
  locations: z.array(z.string()).transform((locations) => locations.map(sanitizeInput)),
  schedule: postScheduleSchema,
  needs: postNeedsSchema,
  title: z.string(),
  contacts: contactsSchema,
});

export const updatePostSchema = createPostSchema.extend({ state: z.enum(postStates) });

export const postSchema = updatePostSchema.extend({ id: z.string() });
