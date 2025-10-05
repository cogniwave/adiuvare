import type { z } from "zod/v4";
import type { createPostSchema, updatePostSchema } from "shared/schemas/post.schema";
import type { Contact } from "./contact";

export type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ScheduleTime {
  id: string;
  start: string;
  end: string;
  error?: boolean;
}

export interface RecurringScheduleTimeGroup {
  day: Day;
  times: ScheduleTime[];
}

export type RecurringSchedule = Record<Day, ScheduleTime[] | null>;

export interface SpecificSchedule {
  day: string;
  times: ScheduleTime[];
}

export const scheduleTypes = ["anytime", "specific", "recurring"] as const;

export type ScheduleType = (typeof scheduleTypes)[number];

interface PostSchedulePayload {
  anytime: { payload: {} };
  specific: { payload: SpecificSchedule };
  recurring: { payload: RecurringSchedule };
}

export type PostSchedule<T extends ScheduleType = ScheduleType> = PostSchedulePayload[T] & { type: T };

export const postNeeds = ["volunteers", "money", "goods", "other"] as const;

export type PostNeed = (typeof postNeeds)[number];

export interface EmptyPost<T extends ScheduleType = ScheduleType> {
  schedule: PostSchedule<T>;
  description: string;
  title: string;
  needs: PostNeed[];
  contacts: Contact[];
  locations: string[];
}

export const postStates = ["suspended", "pending", "active", "inactive", "rejected"] as const;

export type PostState = (typeof postStates)[number];

export interface Post<T extends ScheduleType = ScheduleType> extends EmptyPost<T> {
  id: string;
  logo: string;
  state: PostState;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}

export interface PostBySlug<T extends ScheduleType = ScheduleType> extends Omit<Post<T>, "logo"> {
  schedule: PostSchedule<T>;
  description: string;
  title: string;
  needs: PostNeed[];
  contacts: Contact[];
  locations: string[];
  createdById?: string;
}

export type CreatePostPayload = z.infer<typeof createPostSchema>;

export interface PostDeletePayload {
  id: string;
  title: string;
}

export type PostDisablePayload = PostDeletePayload;

export interface PostStateTogglePayload extends PostDeletePayload {
  enable: boolean;
}

export type UpdatePostPayload = z.infer<typeof updatePostSchema>;

export interface PostHistory<T extends ScheduleType = ScheduleType> {
  updatedBy: string;
  updatedAt: Date;
  state: PostState;
  description: string;
  locations: string[];
  schedule: PostSchedule<T>;
  needs: PostNeed[];
  title: string;
}

export interface NotifyPost {
  id: string;
  createdBy: string;
  title: string;
}

export interface PostFilter {
  query?: string;
  title?: string;
  description?: string;
  locations?: string[];
  needs?: string[];
}
