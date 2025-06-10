import { z } from "zod/v4";

import { postNeeds, postStates, scheduleTypes } from "shared/types/post";
import { sanitizeInput } from "server/utils/request";
import { datesSchema } from "./common.schema";
import { contactSchema } from "./contacts.schema";

const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const scheduleTimeSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

export const postScheduleSchema = z.object({
  type: z.enum(scheduleTypes),
  payload: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("specific"),
      payload: z.object({
        day: z.enum(validDays),
        times: z.array(scheduleTimeSchema).min(1),
      }),
    }),
    z.object({
      type: z.literal("recurring"),
      payload: z.record(z.enum(validDays), z.array(scheduleTimeSchema).min(1)),
    }),
  ]),
});

export const postNeedsSchema = z.array(z.enum(postNeeds));

export const postSchema = z.object({
  id: z.string(),
  title: z.string().max(264).transform(sanitizeInput),
  description: z.string().transform(sanitizeInput),
  locations: z.array(z.string()).transform((locations) => locations.map(sanitizeInput)),
  schedule: postScheduleSchema,
  needs: postNeedsSchema,
  contacts: contactSchema,
  state: z.enum(postStates),
  slug: z.string().transform(sanitizeInput),
  createdUserId: z.string(),
  ...datesSchema.shape,
});

export const createPostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePostSchema = postSchema.pick({
  title: true,
  description: true,
  state: true,
  needs: true,
  locations: true,
  schedule: true,
  contacts: true,
});
