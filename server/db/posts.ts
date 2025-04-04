import type { SQLWrapper, SQL } from "drizzle-orm";
import { and, count, desc, eq, sql, or, arrayOverlaps } from "drizzle-orm";

import { useDrizzle } from "server/db";
import { posts } from "./schemas/posts.schema";
import { users } from "./schemas/users.schema";
import { postHistory } from "./schemas/postHistory.schema";
import { log } from "server/utils/logger";
import type { InsertPost } from "./schemas/posts.schema";

import { FEED_PAGE_SIZE } from "shared/utils";
import { PostStateEnum, type PostFilter, type PostNeed, type UpdatePostPayload } from "shared/types/post";
import { isPostNeed } from "shared/types/guards";

type Query = SQLWrapper[] | SQL<unknown>[] | undefined;

const getFreeInputQuery = (query: string): Query => {
  query = query.toLowerCase();
  const fuzzy = `%${query}%`;

  const conditions: Query = [
    sql`unaccent(lower(${posts.description})) like unaccent(${fuzzy})`,
    sql`unaccent(lower(${posts.title})) like unaccent(${fuzzy})`,
    sql`unaccent(lower(${users.name})) like unaccent(${fuzzy})`,
    sql`unaccent(lower(${users.bio})) like unaccent(${fuzzy})`,
    arrayOverlaps(posts.locations, [query]),
  ];

  if (isPostNeed(query)) {
    conditions.push(arrayOverlaps(posts.needs, [query]));
  }

  return [or(...conditions) as SQL<unknown>];
};

const getDetailedFilter = (filter: PostFilter): Query => {
  const toFuzzy = (str: string) => `%${str}%`;

  const conditions: SQLWrapper[] = [];

  if (filter.title) {
    conditions.push(sql`unaccent(lower(${posts.title})) like unaccent(${toFuzzy(filter.title)})`);
  }

  if (filter.description) {
    conditions.push(sql`unaccent(lower(${posts.description})) like unaccent(${toFuzzy(filter.description)})`);
  }

  if (filter.locations?.length) {
    conditions.push(arrayOverlaps(posts.locations, filter.locations));
  }

  if (filter.needs?.length) {
    conditions.push(arrayOverlaps(posts.needs, filter.needs as PostNeed[]));
  }

  // unexpected filtering
  if (!conditions.length) {
    log("[posts] unexpected filtering in get posts", JSON.stringify(conditions));

    return undefined;
  }

  return conditions;
};

export const getPostsAndTotal = async (filter?: PostFilter) => {
  let query: Query = undefined;

  if (filter) {
    query = filter.query ? getFreeInputQuery(filter.query) : getDetailedFilter(filter);
  }

  const [result, total] = await Promise.all([getPosts(query), getTotalPosts(query)]);

  return { posts: result, total };
};

export const getPosts = async (conditions?: Query) => {
  const query = conditions
    ? and(eq(posts.state, PostStateEnum.ACTIVE), ...conditions)
    : eq(posts.state, PostStateEnum.ACTIVE);

  const result = await useDrizzle()
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      locations: posts.locations,
      needs: posts.needs,
      schedule: posts.schedule,
      createdAt: posts.createdAt,
      slug: posts.slug,
      contacts: posts.contacts,
      createdBy: users.slug,
      createdBySlug: users.slug,
    })
    .from(posts)
    .innerJoin(users, eq(posts.createdUserId, users.id))
    .where(query)
    .orderBy(desc(posts.createdAt))
    .limit(FEED_PAGE_SIZE);

  return result || [];
};

export const getTotalPosts = async (conditions?: Query) => {
  try {
    let result;

    // if filter exists we need to inner join with users because
    // filter can be looking for user prop
    if (conditions) {
      result = await useDrizzle()
        .select({ total: count() })
        .from(posts)
        .innerJoin(users, eq(posts.createdUserId, users.id))
        .where(and(eq(posts.state, PostStateEnum.ACTIVE), ...conditions));
    } else {
      // if filter doesn't exist, we can just query all posts
      result = await useDrizzle().select({ total: count() }).from(posts).where(eq(posts.state, PostStateEnum.ACTIVE));
    }

    return result[0]!.total ?? 0;
  } catch (_) {
    return 0;
  }
};

export const createPost = async (payload: InsertPost) => {
  const result = await useDrizzle().insert(posts).values(payload).returning({
    id: posts.id,
    title: posts.title,
    state: posts.state,
    description: posts.description,
    contacts: posts.contacts,
    needs: posts.needs,
    locations: posts.locations,
    schedule: posts.schedule,
    slug: posts.slug,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
  });

  return result[0]!;
};

export const updatePost = async (slug: string, payload: UpdatePostPayload, userId: string) => {
  const old = await getPostBySlug(slug, true);

  if (!old) {
    return null;
  }

  if (old.createdById !== userId) {
    return { ...old, updated: old };
  }

  await useDrizzle().transaction(async (tx) => {
    // update post
    try {
      await tx
        .update(posts)
        .set({ ...payload, updatedBy: userId })
        .where(eq(posts.slug, slug));

      // add entry to history
      await tx.insert(postHistory).values({
        postId: old.id,
        userId: userId,
        state: old.state,
        description: old.description,
        locations: old.locations,
        schedule: old.schedule,
        needs: old.needs,
        title: old.title,
        slug: old.slug,
        contacts: old.contacts,
      });
    } catch (_) {
      tx.rollback();
    }
  });

  return { ...old, ...payload };
};

export const deletePost = async (id: string) => {
  return await useDrizzle().delete(posts).where(eq(posts.id, id));
};

export const getPost = async (postId: string) => {
  const result = await useDrizzle().select().from(posts).where(eq(posts.id, postId)).limit(1);

  return result.length === 1 ? result[0] : null;
};

export const getPostByOwner = async (postId: string, userId: string) => {
  const result = await useDrizzle()
    .select({ createdBy: users.name })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.createdUserId, userId)))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};

export const getPostBySlug = async (slug: string, getId = false) => {
  const result = await useDrizzle()
    .select({
      id: posts.id,
      title: posts.title,
      description: posts.description,
      locations: posts.locations,
      needs: posts.needs,
      schedule: posts.schedule,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      state: posts.state,
      slug: posts.slug,
      contacts: posts.contacts,
      createdBy: users.slug,
      ...(getId && { createdById: posts.createdUserId }),
    })
    .from(posts)
    .where(and(eq(posts.slug, slug)))
    .innerJoin(users, eq(posts.createdUserId, users.id))
    .limit(1);

  return result.length === 1 ? result[0] : null;
};
