import type { EmptyPost, Post } from "@/types/post";

export const getPosts = async () => {
  return (await $fetch<Post[]>("/api/v1/posts")) || [];
};

export const getTotalPosts = async () => {
  return (
    (await $fetch<number>("/api/v1/posts", { query: { total: true } })) || 0
  );
};

export const addPost = (post: EmptyPost, token: string) => {
  return $fetch<Post>("/api/v1/posts", {
    headers: { Authorization: token },
    body: post,
    method: "post",
  });
};
