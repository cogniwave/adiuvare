<template>
  <v-app>
    <qa-loading :loading="initLoading || isLoading" />

    <NuxtLayout>
      <qa-navbar />

      <!-- todo: add when there's messages and stuffs -->
      <!-- <qa-notifications /> -->

      <qa-snackbar />

      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from "#vue-router";

const { t } = useI18n();
const $route = useRoute();

useHead({
  titleTemplate: () => {
    return $route.meta.title ? `Adiuvare - ${t($route.meta.title as string)}` : "Adiuvare";
  },
});

const { isLoading, start, finish } = useLoadingIndicator();

// show the loading screen on first render as loadingIndicator doesnt seem to be doing its job
const initLoading = ref(true);

onBeforeMount(() => start());

onMounted(() => {
  initLoading.value = false;
  finish();
});
</script>
