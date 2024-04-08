<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <h1>ca tas tu {{ $store.user }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { useSessionStore } from "@/stores/session.store";

definePageMeta({
  path: "/profile/:slug",
  auth: { unauthenticatedOnly: false },
});

const $store = useSessionStore();
</script>
