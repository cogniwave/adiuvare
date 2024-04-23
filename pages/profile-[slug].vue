<template>
  <template v-if="$store.loading">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="$store.posts.length">
    <v-avatar></v-avatar>

    <v-virtual-scroll item-height="264" :items="$store.posts">
      <template v-slot:default="{ item }">
        <qa-post :post="item" class="mb-5" />
      </template>
    </v-virtual-scroll>

    <!-- there aren't enough posts to show pagination -->
    <v-pagination v-if="$store.totalPosts > PER_PAGE" v-model="page" length="5" />
  </template>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { usePostsStore } from "@/stores/posts.store";

definePageMeta({
  path: "/profile/:slug",
  auth: { unauthenticatedOnly: false },
});

const $route = useRoute();
const $store = usePostsStore();
const { data } = useAuth();

const canEdit = ref(false);

onBeforeMount(() => {
  if ($route.params.slug === data.value?.slug) {
    canEdit.value = true;
  }
});
</script>
