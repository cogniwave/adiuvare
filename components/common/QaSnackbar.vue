<template>
  <v-snackbar v-model:model-value="visible" location="right top" :timeout="timeout" :color="type">
    {{ text }}
  </v-snackbar>
</template>

<script setup lang="ts">
const { visible, timeout, type, text } = useNotify();
</script>
