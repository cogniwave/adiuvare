import { PostStateEnum, PostNeed } from "../types/post";

export const POST_STATES = Object.values(PostStateEnum) as [string, ...string[]];
export const POST_NEEDS = Object.values(PostNeed) as [string, ...string[]];
