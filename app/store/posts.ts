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

export const usePosts = <T = AnyPost>(defaultType?: ScheduleType) => {
  const posts = useState<Post[]>("posts:posts", () => []);
  const currPost = useState<T>("posts:current", () => ({}) as T);
  const disableDialogVisible = useState<boolean>("posts:dialogVisible", () => true);
  const deleteDialogVisible = useState<boolean>("posts:dialogVisible", () => true);

  const setDefaultCurrPost = () => {
    if (defaultType === ScheduleType.RECURRING) {
      currPost.value = {
        ...cloneDefault(),
        schedule: { type: ScheduleType.RECURRING },
      };
      return;
    }

    if (defaultType === ScheduleType.SPECIFIC) {
      currPost.value = {
        ...cloneDefault(),
        schedule: {
          type: ScheduleType.RECURRING,
          payload: { day: "", times: [] },
        },
      };
      return;
    }

    currPost.value = cloneDefault();
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
  };
};
