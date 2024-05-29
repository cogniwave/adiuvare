<template>
  <v-app>
    <qa-loading />

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
const { start } = useLoadingIndicator();

onBeforeMount(() => start());
</script>
