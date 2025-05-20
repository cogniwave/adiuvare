import type { Contact } from "./contacts";

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

export enum ScheduleType {
  ANYTIME = "anytime",
  SPECIFIC = "specific",
  RECURRING = "recurring",
}

interface PostSchedulePayload {
  [ScheduleType.ANYTIME]: { payload: {} };
  [ScheduleType.SPECIFIC]: { payload: SpecificSchedule };
  [ScheduleType.RECURRING]: { payload: RecurringSchedule };
}

export type PostSchedule<T extends ScheduleType = ScheduleType> = PostSchedulePayload[T] & { type: T };

export enum PostNeed {
  VOLUNTEERS = "volunteers",
  MONEY = "money",
  GOODS = "goods",
  OTHER = "other",
}

export interface EmptyPost<T extends ScheduleType = ScheduleType> {
  schedule: PostSchedule<T>;
  description: string;
  title: string;
  needs: PostNeed[];
  contacts: Contact[];
  locations: string[];
}

export enum PostStateEnum {
  SUSPENDED = "suspended",
  PENDING = "pending",
  ACTIVE = "active",
  INACTIVE = "inactive",
  REJECTED = "rejected",
}

export type PostState = (typeof PostStateEnum)[keyof typeof PostStateEnum];

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
export interface CreatePostPayload<T extends ScheduleType = ScheduleType> {
  description: string;
  locations: string[];
  schedule: PostSchedule<T>;
  needs: PostNeed[];
  title: string;
  contacts: Contact[];
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
