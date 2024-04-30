<template>
  <nuxt-loading-indicator></nuxt-loading-indicator>

  <qa-feed />

  <qa-post-dialog v-if="dialogRendered" />
</template>

<script setup lang="ts">
import QaFeed from "@/components/feed/QaFeed.vue";

definePageMeta({
  path: "/",
  auth: { unauthenticatedOnly: false },
});

const { dialogRendered } = usePosts();
</script>
