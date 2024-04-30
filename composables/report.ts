import type { PostDeletePayload } from "@/types/post";

export const useReport = () => {
  const post = useState<PostDeletePayload>("report:post", () => ({}) as PostDeletePayload);
  const dialogVisible = useState<boolean>("report:dialogVisible", () => true);
  const dialogRendered = useState<boolean>("report:dialogRendered", () => false);

  const openDialog = (p: PostDeletePayload) => {
    post.value = p;
    if (!dialogRendered.value) {
      dialogRendered.value = true;
    }

    dialogVisible.value = true;
  };

  return { openDialog, post, dialogVisible, dialogRendered };
};
