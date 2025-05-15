<template>
  <v-chip
    label
    variant="outlined"
    prepend-icon="fa-location-dot"
    color="secondary"
    class="cursor-pointer mr-1"
    rounded="md"
    size="small"
  >
    {{ location }}
  </v-chip>
</template>

<script lang="ts" setup>
  defineProps({ location: { type: String, required: true } });
</script>
