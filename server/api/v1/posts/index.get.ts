import { getPostsAndTotal } from "~~/server/db/posts";
import type { TranslationFunction } from "~~/shared/types";
import type { PostFilter } from "~~/shared/types/post";

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

  if (t("posts.needs.other").toLowerCase().includes(filter)) {
    return "other";
  }

  return filter;
};

export default defineEventHandler(async (event) => {
  const t = await useTranslation(event);

  try {
    const qs = getQuery<{ filter: string } | undefined>(event);

    let filter: PostFilter | undefined;

    if (qs?.filter) {
      try {
        filter = JSON.parse(qs.filter);
      } catch (_) {
        //
      }

      if (filter) {
        if (filter.query) {
          filter.query = mapIfNeed(filter.query, t);
        }

        if (filter.needs) {
          filter.needs = filter.needs.map((n) => mapIfNeed(n, t));
        }
      }
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
