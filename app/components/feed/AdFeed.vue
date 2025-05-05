<template>
  <!-- show loading experimentei o valor status, pois pendind está deprecated, mas nao correu postagem e removeu o pagrafo-->
  <template v-if="pending">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="data && (data.total || !!filter)">
    <v-row class="mb-2">
      <v-col cols="12" sm="4" align-self="end">
        <h4>Recent posts</h4>
      </v-col>

      <v-col align-self="end" class="d-flex">
        <form class="pr-2 w-100" @keypress.enter.prevent="onSearch()">
          <v-text-field class="search-field" v-model:model-value="search" variant="solo" flat
                        append-inner-icon="mdi-magnify" rounded="lx" density="compact" hide-details persistent-clear
                        :clearable="!!filter" :placeholder="t('filter.placeholder')" @click:clear="resetSearch()"
                        @click:append-inner.stop.prevent="onSearch()" />
        </form>

        <v-btn icon size="small" flat variant="text" color="primary" @click="toggleExpandedFilter">
          <v-icon color="accent" size="x-small">mdi-filter</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="expandedFilterVisible" class="pa-2 rounded-lg mb-2">
        <span>
          <p>Pesquisa detalhada</p>
        </span>


        <form class="mt-5 mb-3 w-100" @keypress.enter.prevent="onSearch(true)" @submit.prevent="onSearch(true)">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model:model-value="title" prepend-icon="mdi-format-header-1" rounded="lx"
                            density="compact" flat hide-details persistent-clear label="Pesquisar por titulo" />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea v-model:model-value="description" rows="1" prepend-icon="mdi-format-quote-open" rounded="lx"
                          density="compact" flat hide-details persistent-clear label="Pesquisar na descrição" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select v-model:model-value="need" hide-hint multiple prepend-icon="mdi-parachute"
                        :label="t('form.post.category')" :items="needs" />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete v-model:model-value="location" rounded="lx" density="compact"
                              prepend-icon="mdi-map-marker" chips class="detailed-filter" hide-details multiple
                              label="Pesquisar por localidade" no-filter closable-chips :auto-select-first="false"
                              :no-data-text="noDataText" :items="locations" :loading="filteringLocations"
                              @update:search="filterLocations" />
            </v-col>
          </v-row>

          <div class="pt-5 d-flex align-center justify-end">
            <v-btn class="btn-reset" size="x-small" type="submit" variant="text" flat :loading="pending"
                   @click="resetSearch">
              {{ t("feed.emptySearchReset") }}
            </v-btn>

            <v-btn class="filter-actions" size="x-small" type="submit" color="primary" variant="text" flat
                   :loading="pending">
              {{ t("feed.filter") }}
            </v-btn>
          </div>
        </form>

        <v-divider />
      </div>
    </v-expand-transition>

    <v-row no-gutters>
      <v-col>
        <v-virtual-scroll v-if="data.total" item-height="264" :items="data.posts">
          <template #default="{ item }">
            <ad-post :key="item.id" :post="item" :user="user?.slug || ''" class="mb-5" @click:state="openDisableDialog"
                     @click:delete="openDeleteDialog" @click:report="openReportDialog" />
          </template>
        </v-virtual-scroll>

        <i18n-t v-else scope="global" keypath="feed.emptySearch" tag="span" for="feed.emptySearchReset"
                class="no-posts">
          <v-btn variant="text" color="primary" size="x-small" @click="resetSearch">
            {{ t("feed.emptySearchReset") }}
          </v-btn>
        </i18n-t>
      </v-col>
    </v-row>

    <!-- there aren't enough posts to show pagination -->
    <v-pagination v-if="data.total > FEED_PAGE_SIZE" v-model="page" total-visible="5" color="primary" rounded
                  :length="data.total / FEED_PAGE_SIZE" />
  </template>

  <!-- no posts exist -->
  <i18n-t v-else scope="global" keypath="feed.noPosts" tag="h3" for="feed.noPostsButton" class="no-posts">
    <nuxt-link to="/posts/new">
      {{ t("feed.noPostsButton") }}
    </nuxt-link>
  </i18n-t>

  <ad-post-report-dialog v-if="reportDialogRendered" />

  <ad-post-disable-confirm-dialog v-if="disableDialogRendered" />

  <ad-post-delete-confirm-dialog v-if="deleteDialogRendered" @delete="onDelete" />
</template>

<script setup lang="ts">
  import { useNotify } from "app/store/notify";
  import { usePosts } from "app/store/posts";
  import { useReport } from "app/store/report";
  import { FEED_PAGE_SIZE } from "shared/utils";

  import type { Post, PostDeletePayload, PostStateTogglePayload, PostFilter } from "shared/types/post";
  import AdPost from "app/components/posts/AdPost.vue";
  import type { SelectOption } from "shared/types/form";

  const $route = useRoute();

  const { notifyError } = useNotify();
  const { user } = useUserSession();
  const { currPost, disableDialogVisible, deleteDialogVisible, posts } = usePosts();
  const { openDialog: _openReportDialog } = useReport();
  const { t } = useI18n();
  const { filterLocations, filteringLocations, locations, noDataText } = useLocations();
  const $router = useRouter();

  const search = ref<string | undefined>();
  const reportDialogRendered = ref(false);
  const expandedFilterVisible = ref(false);

  const title = ref<string | undefined>();
  const description = ref<string | undefined>();
  const location = ref<string[] | undefined>();
  const need = ref<string[] | undefined>();

  const needs = ref<SelectOption[]>([
    { title: t("posts.needs.money"), value: "money" },
    { title: t("posts.needs.volunteers"), value: "volunteers" },
    { title: t("posts.needs.goods"), value: "goods" },
    { title: t("posts.needs.other"), value: "other" },
  ]);

  const deleteDialogRendered = ref(false);
  const disableDialogRendered = ref(false);

  const page = ref(setupPage());
  const filter = ref<PostFilter | undefined>(setupQuery());

  const { data, pending, refresh } = useFetch<{ posts: Post[]; total: number }>("/api/v1/posts", {
    query: { filter: filter.value, page: page.value },
    lazy: true,
    onResponse({ response }) {
      posts.value = response._data?.posts || [];
    },
    onResponseError() {
      data.value = { posts: [], total: 0 };
      posts.value = [];

      notifyError(t("errors.fetchFeed"));
    },
  });

  const openDisableDialog = (post: PostStateTogglePayload) => {
    currPost.value = post;
    if (!disableDialogRendered.value) {
      disableDialogRendered.value = true;
    } else {
      disableDialogVisible.value = true;
    }
  };

  const openDeleteDialog = (post: PostDeletePayload) => {
    currPost.value = post;
    if (!deleteDialogRendered.value) {
      deleteDialogRendered.value = true;
    } else {
      deleteDialogVisible.value = true;
    }
  };

  const openReportDialog = (post: PostDeletePayload) => {
    if (!reportDialogRendered.value) {
      reportDialogRendered.value = true;
    }

    _openReportDialog(post);
  };

  const onDelete = async (id: string) => {
    try {
      await $fetch<Post>(`/api/v1/posts/${id}`, { method: "delete" });
      refresh();
    } catch (err: unknown) {
      notifyError(err as string);
    } finally {
      disableDialogVisible.value = false;
    }
  };

  const onSearch = (detailed = false) => {
    if (detailed) {
      if (!title.value && !description.value && !location.value?.length && !need.value?.length) {
        return;
      }

      filter.value = {
        title: title.value,
        description: description.value,
        locations: location.value?.length ? location.value : undefined,
        needs: need.value?.length ? need.value : undefined,
      };
    } else {
      if (!search.value) {
        return;
      }

      if (search.value === filter.value) {
        return;
      }

      filter.value = { query: search.value };
    }

    page.value = 1;

    $router.push({ path: "/", query: { page: 1, ...filter.value } });
    refresh();
  };

  const toggleExpandedFilter = () => (expandedFilterVisible.value = !expandedFilterVisible.value);

  const resetSearch = () => {
    page.value = 1;
    filter.value = undefined;
    search.value = undefined;
    title.value = undefined;
    description.value = undefined;
    location.value = undefined;
    need.value = undefined;

    $router.push({ path: "/", query: {} });
  };

  function setupPage() {
    const page = $route.query?.page;

    if (!page) {
      return 1;
    }

    const p = Number(page);

    return !isNaN(p) && p > 1 ? p : 1;
  }

  function setupQuery() {
    const query = $route.query;

    if (!query) {
      return undefined;
    }

    const f: PostFilter = {};

    if (!query.query) {
      if (query.title) {
        title.value = query.title as string;
        f.title = title.value;
      }

      if (query.description) {
        description.value = query.description as string;
        f.description = description.value;
      }

      if (query.needs) {
        need.value = query.needs as string[];
        f.needs = need.value;
      }

      if (query.locations) {
        location.value = query.locations as string[];
        f.locations = location.value;
      }
    } else {
      search.value = query.query as string;
      f.query = search.value;
    }

    if (Object.keys(f).length) {
      filter.value = f;
    }
  }

  watch(page, (pg) => {
    $router.push({ path: "/", query: { ...($router.currentRoute.value.query || {}), page: pg } });
  });
</script>

<style scoped>
  .v-autocomplete__content {
    max-width: 200px !important;

    .v-list-item-title {
      white-space: initial !important;
    }
  }

  h4 {
    color: rgba(var(--v-theme-subtext));

  }

  .search-field :deep(.v-field__append-inner .v-icon) {
    color: rgba(var(--v-theme-accent));
  }

  p {
    color: rgba(var(--v-theme-subtext));
  }

  :deep(.btn-reset .v-btn__content),
  :deep(.filter-actions .v-btn__content) {
    color: rgba(var(--v-theme-primary));
  }

  .v-virtual-scroll {
    overflow: visible !important;
  }

</style>
