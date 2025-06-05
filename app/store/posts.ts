import type {
  ScheduleType,
  Post,
  PostDeletePayload,
  PostStateTogglePayload,
  PostDisablePayload,
  EmptyPost,
} from "shared/types/post";

type AnyPost<T extends ScheduleType = "anytime"> =
  | Post<T>
  | PostStateTogglePayload
  | PostDeletePayload
  | PostDisablePayload
  | EmptyPost;

const DEFAULT_POST = {
  schedule: { type: "anytime" },
  description: "",
  title: "",
  needs: [],
  contacts: [],
  locations: [],
};

const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_POST));

const getTypeDefaultConfig = (type: ScheduleType) => {
  if (type === "anytime") {
    return { type: "anytime" };
  }

  if (type === "specific") {
    return { type: "specific", payload: { day: "", times: [] } };
  }

  return { type: "recurring", payload: {} };
};

export const usePosts = <T = AnyPost>(defaultType?: ScheduleType) => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const updateScheduleType = (newType: ScheduleType) => {
    // @ts-expect-error todo: fix this
    (currPost.value as Post).schedule = getTypeDefaultConfig(newType);
  };

  const setDefaultCurrPost = () => {
    currPost.value =
      defaultType === "anytime" ? cloneDefault() : { ...cloneDefault(), schedule: getTypeDefaultConfig("recurring") };
  };

  const setPost = (post: T | null, useDefault: boolean = false) => {
    if (!post && useDefault) {
      setDefaultCurrPost();
    } else {
      currPost.value = post as T;
    }
  };

  if (defaultType) {
    setDefaultCurrPost();
  }

  return {
    currPost,
    posts,
    disableDialogVisible,
    deleteDialogVisible,
    setPost,
    setDefaultCurrPost,
    updateScheduleType,
  };
};
