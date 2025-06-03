import { z } from "zod/v4";

import { postNeeds, scheduleTypes } from "shared/types/post";

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
