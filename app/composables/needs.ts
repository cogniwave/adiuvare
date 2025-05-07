import type { PostNeed } from "shared/types/post";

interface ConfigItem {
  icon: string;
  color: string;
  label: string;
  description: string;
}

type Config = Record<PostNeed, ConfigItem>;

export const useNeed = () => {
  const getNeedDetails = (need: PostNeed): ConfigItem => {
    const NEED_MAPPING: Config = {
      money: {
        icon: "fa-solid fa-coins",
        color: "green",
        label: "posts.needs.money",
        description: "posts.needs.moneyDescription",
      },
      goods: {
        icon: "fa-solid fa-boxes-stacked",
        color: "blue",
        label: "posts.needs.goods",
        description: "posts.needs.goodsDescription",
      },
      volunteers: {
        icon: "fa-solid fa-people-arrows",
        color: "purple",
        label: "posts.needs.volunteers",
        description: "posts.needs.volunteersDescription",
      },
      other: {
        icon: "fa-solid fa-circle-question",
        color: "orange",
        label: "posts.needs.other",
        description: "posts.needs.otherDescription",
      },
    };

    return NEED_MAPPING[need]!;
  };

  return { getNeedDetails };
};
