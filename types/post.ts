import type { UserContact } from "./user";

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

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

export type ScheduleType = "anytime" | "specific" | "recurring";

export interface PostSchedule {
  type: ScheduleType;
  // no payload if type == anytime
  // RecurringScheduleTimeGroup if type == specific
  // else RecurringSchedule
  payload?: RecurringSchedule | SpecificSchedule;
}

export type PostCategory = "volunteers" | "money" | "goods" | "other";

export interface EmptyPost {
  schedule: PostSchedule;
  description: string;
  title: string;
  needs: PostCategory[];
  contacts: UserContact[];
  locations: string[];
}

export type PostState = "pending" | "active" | "inactive" | "rejected";

export interface Post extends EmptyPost {
  id: string;
  logo: string;
  state: PostState;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface CreatePostPayload {
  description: string;
  locations: string[];
  schedule: PostSchedule;
  needs: PostCategory[];
  title: string;
  contacts: UserContact[];
}

export interface PostDeletePayload {
  id: string;
  title: string;
}

export type PostDisablePayload = PostDeletePayload;

export interface PostStateTogglePayload extends PostDeletePayload {
  enable: boolean;
}

export interface UpdatePostPayload extends CreatePostPayload {
  state: PostState;
  // updatedBy: string;
}

export interface PostHistory {
  updatedBy: string;
  updatedAt: Date;
  state: PostState;
  description: string;
  locations: string[];
  schedule: PostSchedule;
  needs: PostCategory[];
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
