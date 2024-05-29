<template>
  <v-app>
    <qa-loading :loading="initLoading || isLoading" />

    <NuxtLayout>
      <qa-navbar />

      <!-- todo: add when there's messages and stuffs -->
      <!-- <qa-notifications /> -->

      <qa-snackbar />

      <NuxtLoadingIndicator />

      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
const { isLoading, start, finish } = useLoadingIndicator();

// show the loading screen on first render as loadingIndicator doesnt seem to be doing its job
const initLoading = ref(true);

onBeforeMount(() => start());

onMounted(() => {
  initLoading.value = false;
  finish();
});
</script>
