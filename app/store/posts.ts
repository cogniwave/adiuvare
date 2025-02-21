import type {
  Post,
  PostDeletePayload,
  PostStateTogglePayload,
  PostDisablePayload,
  EmptyPost,
} from "~~/shared/types/post";

type AnyPost = Post | PostStateTogglePayload | PostDeletePayload | PostDisablePayload | EmptyPost;

export const usePosts = <T = AnyPost>() => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const setPost = (post: T | null) => (currPost.value = post as T);

  return {
    currPost,
    posts,
    disableDialogVisible,
    deleteDialogVisible,
    setPost,
  };
};
