<template>
  <qa-feed />

  <qa-post-dialog v-if="store.dialogRendered" />
</template>

<script setup lang="ts">
import QaFeed from "@/components/feed/QaFeed.vue";
import { usePostsStore } from "@/stores/posts.store";

definePageMeta({
  path: "/",
  auth: { unauthenticatedOnly: false },
});

const store = usePostsStore();
</script>
