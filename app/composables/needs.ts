import type { PostNeed } from "shared/types/post";

interface ConfigItem {
  icon: string;
  color: string;
  label: string;
  description: string;
}

const NEED_MAPPING: Record<PostNeed, ConfigItem> = {
  money: {
    icon: "fa-coins",
    color: "success",
    label: "posts.needs.money",
    description: "posts.needs.moneyDescription",
  },
  goods: {
    icon: "fa-boxes-stacked",
    color: "primary",
    label: "posts.needs.goods",
    description: "posts.needs.goodsDescription",
  },
  volunteers: {
    icon: "fa-people-arrows",
    color: "accent",
    label: "posts.needs.volunteers",
    description: "posts.needs.volunteersDescription",
  },
  other: {
    icon: "fa-circle-question",
    color: "text",
    label: "posts.needs.other",
    description: "posts.needs.otherDescription",
  },
};

export const useNeed = () => {
  const getNeedDetails = (need: PostNeed) => NEED_MAPPING[need]!;

  return { getNeedDetails };
};
