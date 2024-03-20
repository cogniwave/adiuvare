<template>
  <v-snackbar
    v-model:model-value="$store.visible"
    location="right top"
    :timeout="$store.timeout"
    :color="$store.type"
  >
    {{ $store.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotifyStore } from "@/stores/notify.store";

const $store = useNotifyStore();
</script>
