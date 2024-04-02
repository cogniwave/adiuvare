<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <h1>ca tas tu {{ $route.params.slug }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const $route = useRoute();
</script>
