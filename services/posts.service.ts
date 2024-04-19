import type { EmptyPost, Post } from "@/types/post";

interface UpdatePostPayload {
  action: "disable";
  [key: string]: any;
}

const updatePost = (id: string, payload?: UpdatePostPayload) => {
  return $fetch<Post>(`/api/v1/posts/${id}`, { body: payload, method: "patch" });
};

export const getPosts = async () => {
  return (await $fetch<Post[]>("/api/v1/posts")) || [];
};

export const getTotalPosts = async () => {
  return (await $fetch<number>("/api/v1/posts", { query: { total: true } })) || 0;
};

export const addPost = (post: EmptyPost) => {
  return $fetch<Post>("/api/v1/posts", { body: post, method: "post" });
};

export const disablePost = (id: string) => updatePost(id, { action: "disable" });

export const deletePost = (id: string) => {
  return $fetch<Post>(`/api/v1/posts/${id}`, { method: "delete" });
};

export const getPostBySlug = (slug: string) => {
  return $fetch<Post>(`/api/v1/posts/${slug}`, { method: "get" });
};
