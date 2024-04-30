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
  <template v-else-if="data.posts.length">
    <p class="mb-5">Recent posts</p>

    <v-virtual-scroll item-height="264" :items="data.posts">
      <template v-slot:default="{ item }">
        <qa-post
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

    <!-- there aren't enough posts to show pagination -->
    <v-pagination v-if="data.total > PER_PAGE" v-model="page" length="5" />
  </template>

  <!-- no posts exist -->
  <template v-else>
    <i18n-t scope="global" keypath="feed.noPosts" tag="h3" for="feed.noPostsButton">
      <nuxt-link to="/posts/new">
        {{ $t("feed.noPostsButton") }}
      </nuxt-link>
    </i18n-t>
  </template>

  <qa-post-report-dialog v-if="reportDialogRendered" />

  <qa-post-disable-confirm-dialog v-if="disableDialogRendered" />

  <qa-post-delete-confirm-dialog v-if="deleteDialogRendered" @delete="onDelete" />
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useNotifyStore } from "@/stores/notify.store";
import type { Post, PostDeletePayload, PostStateTogglePayload } from "@/types/post";
import QaPost from "@/components/posts/QaPost.vue";

const PER_PAGE = 30;

const $notifyStore = useNotifyStore();
const { data: user } = useAuth();
const { currPost, disableDialogVisible, deleteDialogVisible, posts } = usePosts();
const { openDialog: _openReportDialog } = useReport();

const page = ref(0);
const reportDialogRendered = ref(false);

const { data, pending, execute, refresh } = useFetch<{ posts: Post[]; total: number }>(
  "/api/v1/posts",
  { query: { page }, watch: [page], lazy: true, immediate: false },
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
    $notifyStore.notifyError(err);
  } finally {
    disableDialogVisible.value = false;
  }
};

watch(
  () => data.value,
  (data) => (posts.value = data?.posts || []),
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
