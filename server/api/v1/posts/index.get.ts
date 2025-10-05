import { getPostsAndTotal } from "server/database/posts";
import { translate } from "server/utils/i18n";

import type { PostFilter } from "shared/types/post";

// because free search with i18n, we need some magics to
// convert users input into the value thats saved in the db
const mapIfNeed = (filter: string) => {
  if (translate("posts.needs.money").toLowerCase().includes(filter)) {
    return "money";
  }

  if (translate("posts.needs.goods").toLowerCase().includes(filter)) {
    return "goods";
  }

  if (translate("posts.needs.volunteers").toLowerCase().includes(filter)) {
    return "volunteers";
  }

  if (translate("posts.needs.other").toLowerCase().includes(filter)) {
    return "other";
  }

  return filter;
};

export default defineWrappedResponseHandler(async (event) => {
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
        filter.query = mapIfNeed(filter.query);
      }

      if (filter.needs) {
        filter.needs = filter.needs.map<string>((n) => mapIfNeed(n));
      }
    }
  }

  return await getPostsAndTotal(filter);
});
