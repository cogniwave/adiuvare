import { desc, eq } from "drizzle-orm";

import { db } from "./";
import { posts } from "./schemas/posts";
import { users } from "./schemas/users";

import type { InsertPost } from "./schemas/posts";
import type { Post } from "~/types/post";

export const getPosts = async () => {
  const result: Post[] = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      locations: posts.locations,
      needs: posts.needs,
      schedule: posts.schedule,
      createdAt: posts.createdAt,
      createdBy: users.name,
    })
    .from(posts)
    .where(eq(posts.state, "visible"))
    .innerJoin(users, eq(posts.createdUserId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(50);

  return result || [];
};

export const createPost = async (payload: InsertPost) => {
  return await db.insert(posts).values(payload);
};
