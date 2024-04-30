<template>
  <div class="fullscreen bg-blue text-white text-center flex flex-center">
    <h1>ca tas tu {{ data }}</h1>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  path: "/profile",
  auth: { unauthenticatedOnly: false },
});

const { data } = useAuth();
</script>
