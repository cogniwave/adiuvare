import {
  type Post,
  type PostDeletePayload,
  type PostStateTogglePayload,
  type PostDisablePayload,
  type EmptyPost,
  ScheduleType,
} from "shared/types/post";

type AnyPost<T extends ScheduleType = ScheduleType.ANYTIME> =
  | Post<T>
  | PostStateTogglePayload
  | PostDeletePayload
  | PostDisablePayload
  | EmptyPost;

const DEFAULT_POST = {
  schedule: { type: ScheduleType.ANYTIME },
  description: "",
  title: "",
  needs: [],
  contacts: [],
  locations: [],
};

const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_POST));

const getTypeDefaultConfig = (type: ScheduleType) => {
  if (type === ScheduleType.ANYTIME) {
    return { type: ScheduleType.ANYTIME };
  }

  if (type === ScheduleType.SPECIFIC) {
    return { type: ScheduleType.SPECIFIC, payload: { day: "", times: [] } };
  }

  return { type: ScheduleType.RECURRING, payload: {} };
};

export const usePosts = <T = AnyPost>(defaultType?: ScheduleType) => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const updateScheduleType = (newType: ScheduleType) => {
    (currPost.value as Post).schedule = getTypeDefaultConfig(newType);
  };

  const setDefaultCurrPost = () => {
    currPost.value =
      defaultType === ScheduleType.ANYTIME
        ? cloneDefault()
        : { ...cloneDefault(), schedule: getTypeDefaultConfig(ScheduleType.RECURRING) };
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
