import type { Post, PostDeletePayload, PostStateTogglePayload } from "@/types/post";

type AnyPost = Post | PostStateTogglePayload | PostDeletePayload;

export const usePosts = <T = AnyPost>() => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const setPost = (post: T) => (currPost.value = post);

  return {
    currPost,
    posts,
    disableDialogVisible,
    deleteDialogVisible,
    setPost,
  };
};
