import type {
  RecurringSchedule,
  ScheduleType,
  SpecificSchedule,
} from "@/components/models";

export interface PostSchedule {
  type: ScheduleType;
  payload?: RecurringSchedule | SpecificSchedule;
}

export interface EmptyPost {
  schedule: PostSchedule;
  description: string;
  title: string;
  tags: string[];
  locations: string[];
}

export interface Post extends EmptyPost {
  id: string;
  createdBy: Date;
  createdAt: Date;
}
