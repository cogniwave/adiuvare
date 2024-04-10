<template>
  <!-- show loading -->
  <template v-if="$postsStore.loading">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="$postsStore.posts.length">
    <p class="mb-5">Recent posts</p>

    <v-virtual-scroll item-height="264" :items="$postsStore.posts">
      <template v-slot:default="{ item }">
        <qa-post
          :post="item"
          :user="data?.slug || ''"
          class="mb-5"
          @click:state="openDisableDialog"
          @click:delete="openDeleteDialog"
        />
      </template>
    </v-virtual-scroll>

    <!-- there aren't enough posts to show pagination -->
    <v-pagination v-if="$postsStore.totalPosts > PER_PAGE" v-model="page" length="5" />
  </template>

  <!-- no posts exist -->
  <template v-else>
    <i18n-t scope="global" keypath="feed.noPosts" tag="h3" for="feed.noPostsButton">
      <span @click="$postsStore.openDialog">
        {{ $t("feed.noPostsButton") }}
      </span>
    </i18n-t>
  </template>

  <qa-post-report-dialog v-if="$reportStore.dialogRendered" />

  <qa-post-disable-confirm-dialog v-if="disableDialogRendered" />

  <qa-post-delete-confirm-dialog v-if="deleteDialogRendered" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import type { PostDeletePayload, PostStateTogglePayload } from "@/types/post";
import QaPost from "@/components/posts/QaPost.vue";
import { usePostsStore } from "@/stores/posts.store";
import { useReportStore } from "@/stores/report.store";

const PER_PAGE = 30;

const $postsStore = usePostsStore();
const $reportStore = useReportStore();
const { data } = useAuth();

const page = ref(0);
const deleteDialogRendered = ref(false);
const disableDialogRendered = ref(false);

onBeforeMount(() => {
  useAsyncData("posts", () => $postsStore.getPosts());

  useAsyncData("posts", () => $postsStore.getTotalPosts());
});

const openDisableDialog = (post: PostStateTogglePayload) => {
  $postsStore.setPost(post);

  if (!disableDialogRendered.value) {
    disableDialogRendered.value = true;
  } else {
    $postsStore.toggleDisableDialog(true);
  }
};

const openDeleteDialog = (post: PostDeletePayload) => {
  $postsStore.setPost(post);

  if (!deleteDialogRendered.value) {
    deleteDialogRendered.value = true;
  } else {
    $postsStore.toggleDeleteDialog(true);
  }
};
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
