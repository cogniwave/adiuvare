<template>
  <v-row no-gutters class="mt-10">
    <v-col offset="3" cols="6">
      <qa-feed />

      <qa-post-dialog v-if="store.dialogRendered" />
    </v-col>
  </v-row>
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
