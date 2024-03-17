import { desc } from "drizzle-orm";

import { db } from "./";
import { posts } from "./schemas/posts";

import type { SelectPost } from "./schemas/posts";

export const getPosts = async () => {
  const result: SelectPost[] = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(50);

  return result || [];
};
