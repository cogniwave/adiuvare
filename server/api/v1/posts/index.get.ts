import { getPostsAndTotal } from "@/server/db/posts";
import type { TranslationFunction } from "@/types";

// because free search with i18n, we need some magics to
// convert users input into the value thats saved in the db
const mapIfNeed = (filter: string, t: TranslationFunction) => {
  if (t("posts.needs.money").toLowerCase().includes(filter)) {
    return "money";
  }

  if (t("posts.needs.goods").toLowerCase().includes(filter)) {
    return "goods";
  }

  if (t("posts.needs.volunteers").toLowerCase().includes(filter)) {
    return "volunteers";
  }

  return filter;
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  try {
    let filter = ((getQuery(event)?.filter as string) || "").toLowerCase();

    if (filter) {
      filter = mapIfNeed(filter, t);
    }

    return await getPostsAndTotal(filter);
  } catch (err) {
    console.log(err);

    useBugsnag().notify({
      name: "failed to get posts",
      message: JSON.stringify(err),
    });

    throw createError({
      statusCode: 500,
      statusMessage: t("errors.unexpected"),
    });
  }
});
