<template>
  <nuxt-loading-indicator></nuxt-loading-indicator>

  <qa-feed />
</template>

<script setup lang="ts">
import QaFeed from "@/components/feed/QaFeed.vue";

definePageMeta({ path: "/" });
</script>
