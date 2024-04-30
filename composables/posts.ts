import type { Post, PostDeletePayload, PostStateTogglePayload } from "@/types/post";

type AnyPost = Post | PostStateTogglePayload | PostDeletePayload;

export const usePosts = <T = AnyPost>() => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const dialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const dialogRendered = useState<boolean>("posts:dialogRendered", () => false);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const setPost = (post: T) => (currPost.value = post);

  const openDialog = () => {
    dialogRendered.value = true;
    dialogVisible.value = true;
  };

  return {
    currPost,
    posts,
    dialogVisible,
    dialogRendered,
    disableDialogVisible,
    deleteDialogVisible,
    setPost,
    openDialog,
  };
};
