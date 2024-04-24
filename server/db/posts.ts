import { and, count, desc, eq } from "drizzle-orm";

import { db } from "./";
import { posts } from "./schemas/posts.schema";
import { users } from "./schemas/users.schema";
import { postHistory } from "./schemas/postHistory.schema";

import type { InsertPost } from "./schemas/posts.schema";
import type { Post, UpdatePostPayload } from "~/types/post";

export const getPosts = async () => {
  const result = (await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      locations: posts.locations,
      needs: posts.needs,
      schedule: posts.schedule,
      createdAt: posts.createdAt,
      slug: posts.slug,
      createdBy: users.slug,
      contacts: users.contacts,
      createdBySlug: users.slug,
    })
    .from(posts)
    .where(eq(posts.state, "visible"))
    .innerJoin(users, eq(posts.createdUserId, users.id))
    .orderBy(desc(posts.createdAt))
    .limit(50)) as Post[];

  return result || [];
};

export const getTotalPosts = async () => {
  const result = await db.select({ total: count() }).from(posts);

  try {
    return result[0].total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const createPost = async (payload: InsertPost) => {
  return await db.insert(posts).values(payload);
};

export const updatePost = async (postId: string, payload: UpdatePostPayload, userId: string) => {
  const old = await getPost(postId);

  if (!old) {
    return null;
  }

  if (old.createdUserId !== userId) {
    return { old, updated: old };
  }

  await db.transaction(async (tx) => {
    // update post
    await tx
      .update(posts)
      .set({ ...payload, updatedBy: userId })
      .where(eq(posts.id, postId));
    try {
      // add entry to history
      await tx.insert(postHistory).values({
        postId: postId,
        userId: userId,
        updatedAt: new Date(),
        state: old.state,
        description: old.description,
        locations: old.locations,
        schedule: old.schedule,
        needs: old.needs,
        title: old.title,
      });
    } catch (err) {
      tx.rollback();
    }
  });

  return { old, updated: { ...old, ...payload } };
};

export const deletePost = async (id: string) => {
  return await db.delete(posts).where(eq(posts.id, id));
};

export const getPost = async (postId: string) => {
  const result = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

  return result.length === 1 ? result[0] : null;
};

export const getPostByOwner = async (postId: string, userId: string) => {
  const result = await db
    .select({ createdBy: users.name })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.createdUserId, userId)))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};

export const getPostBySlug = async (slug: string) => {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      locations: posts.locations,
      needs: posts.needs,
      schedule: posts.schedule,
      createdAt: posts.createdAt,
      slug: posts.slug,
      createdBy: users.slug,
      contacts: users.contacts,
    })
    .from(posts)
    .where(and(eq(posts.slug, slug)))
    .innerJoin(users, eq(posts.createdUserId, users.id))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};
