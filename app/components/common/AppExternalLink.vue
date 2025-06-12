<template>
  <a :href="href" target="blank" rel="noreferrer">
    {{ label }}

    <v-icon>fa-up-right-from-square</v-icon>
  </a>
</template>

<script setup lang="ts">
  defineProps({
    href: { type: String, required: true },
    label: { type: String, default: null },
  });
</script>
