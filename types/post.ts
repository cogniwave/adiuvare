import { Dayjs } from "dayjs";

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
  day: Dayjs;
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
  locations: string[];
}

export interface Post extends EmptyPost {
  id: string;
  createdBy: string;
  createdAt: Date;
}

export interface CreatePostPayload {
  description: string;
  locations: string[];
  schedule: PostSchedule;
  needs: PostCategory[];
  title: string;
}
