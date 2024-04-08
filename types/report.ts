import type { Post } from "./post";

export interface Report {
  post: Post;
  user: string;
  reason: string;
}
