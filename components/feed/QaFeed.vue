<template>
  <!-- show loading -->
  <template v-if="$store.loading">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="$store.posts.length">
    <p class="mb-5">Recent posts</p>

    <v-virtual-scroll item-height="264" :items="$store.posts">
      <template v-slot:default="{ item }">
        <qa-post :post="item" class="mb-5" />
      </template>
    </v-virtual-scroll>

    <!-- there aren't enough posts to show pagination -->
    <v-pagination
      v-if="$store.totalPosts > PER_PAGE"
      v-model="page"
      length="5"
    />
  </template>

  <!-- no posts exist -->
  <template v-else>
    <i18n-t
      scope="global"
      keypath="feed.noPosts"
      tag="h3"
      for="feed.noPostsButton"
    >
      <span @click="$store.openDialog">{{ $t("feed.noPostsButton") }}</span>
    </i18n-t>
  </template>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import QaPost from "@/components/QaPost.vue";
import { usePostsStore } from "@/stores/posts.store";

const PER_PAGE = 30;

const $store = usePostsStore();

const page = ref(0);

onBeforeMount(() => {
  useAsyncData("posts", () => $store.getPosts());

  useAsyncData("posts", () => $store.getTotalPosts());
});
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
