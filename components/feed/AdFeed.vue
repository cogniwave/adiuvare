<template>
  <!-- show loading -->
  <template v-if="pending || !data">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="data.total || !!filter">
    <v-row class="mb-2">
      <v-col cols="5" align-self="end">
        <p>Recent posts</p>
      </v-col>

      <v-col align-self="end">
        <form class="pr-2 w-100" @keypress.enter.prevent="onSearch">
          <v-text-field
            v-model:model-value="search"
            variant="solo"
            flat
            append-inner-icon="fa-solid fa-magnifying-glass"
            rounded="lx"
            density="compact"
            hide-details
            persistent-clear
            :clearable="!!filter"
            :placeholder="t('filter.placeholder')"
            @click:clear="onSearch"
            @click:append-inner="onSearch"
          />
        </form>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-virtual-scroll v-if="data.total" item-height="264" :items="data.posts">
          <template v-slot:default="{ item }">
            <ad-post
              :post="item"
              :user="user?.slug || ''"
              :key="item.id"
              class="mb-5"
              @click:state="openDisableDialog"
              @click:delete="openDeleteDialog"
              @click:report="openReportDialog"
            />
          </template>
        </v-virtual-scroll>

        <span v-else>{{ t("feed.emptySearch") }}</span>
      </v-col>
    </v-row>

    <!-- there aren't enough posts to show pagination -->
    <v-pagination
      v-if="data.total > FEED_PAGE_SIZE"
      v-model="page"
      total-visible="5"
      color="primary"
      rounded
      :length="data.total / FEED_PAGE_SIZE"
    />
  </template>

  <!-- no posts exist -->
  <i18n-t v-else scope="global" keypath="feed.noPosts" tag="h3" for="feed.noPostsButton">
    <nuxt-link to="/posts/new">
      {{ t("feed.noPostsButton") }}
    </nuxt-link>
  </i18n-t>

  <ad-post-report-dialog v-if="reportDialogRendered" />

  <ad-post-disable-confirm-dialog v-if="disableDialogRendered" />

  <ad-post-delete-confirm-dialog v-if="deleteDialogRendered" @delete="onDelete" />
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useAuth } from "@/store/auth";
import { useNotify } from "@/store/notify";
import { usePosts } from "@/store/posts";
import { useReport } from "@/store/report";
import { FEED_PAGE_SIZE } from "@/utils";

import type { Post, PostDeletePayload, PostStateTogglePayload } from "@/types/post";
import AdPost from "@/components/posts/AdPost.vue";

const { notifyError } = useNotify();
const { data: user } = useAuth();
const { currPost, disableDialogVisible, deleteDialogVisible, posts } = usePosts();
const { openDialog: _openReportDialog } = useReport();
const { t } = useI18n();

const page = ref(1);
const search = ref("");
const filter = ref("");
const reportDialogRendered = ref(false);

const { data, pending, execute, refresh, error } = useFetch<{ posts: Post[]; total: number }>(
  "/api/v1/posts",
  {
    query: { page, filter },
    watch: [page, filter],
    lazy: true,
    immediate: false,
  },
);

const deleteDialogRendered = ref(false);
const disableDialogRendered = ref(false);

// todo: figure out a way to use pending without this...
// using fetch on immediate makes it so pending is always true
// whenever the page loads, which results in a hydration mismatch
// and ghost elements in the list
onBeforeMount(execute);

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
  } catch (err: any) {
    notifyError(err);
  } finally {
    disableDialogVisible.value = false;
  }
};

const onSearch = () => {
  console.log("onsearch");
  page.value = 1;
  filter.value = search.value;
};

watch(
  () => data.value,
  (data) => (posts.value = data?.posts || []),
);

watch(
  () => error.value,
  () => {
    data.value = { posts: [], total: 0 };
    notifyError(t("errors.fetchFeed"));
  },
);
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  font-weight: normal;

  span {
    font-size: inherit;
    color: rgba(var(--v-theme-primary));
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      transition: 0.2s;
      opacity: 0.6;
    }
  }
}
</style>
