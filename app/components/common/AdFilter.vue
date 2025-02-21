<template>
  <v-input v-model="filter" type="text" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const filter = ref<string>(String(route.query?.filter || ""));
</script>
