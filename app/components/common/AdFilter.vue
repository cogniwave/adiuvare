<template>
  <v-input v-model="filter" type="text" />
</template>

<script setup lang="ts">
  const route = useRoute();

  const filter = ref<string>(String(route.query?.filter || ""));
</script>
