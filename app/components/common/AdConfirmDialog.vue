<template>
  <v-dialog :model-value="modelValue" width="30vw" @update:model-value="$emit('click:close')">
    <v-card>
      <v-card-title class="bg-primary">
        <h2 class="text-h5 text-white my-1">
          {{ title }}
        </h2>
      </v-card-title>

      <v-card-text class="py-5">
        <slot/>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <v-btn type="submit" color="primary" :loading="loading" @click="$emit('click:submit')">
          {{ confirmText }}
        </v-btn>

        <v-btn variant="flat" :disable="loading" @click="$emit('click:close')">
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const $emit = defineEmits<{ (e: "click:submit" | "click:close"): void }>();

defineProps({
  cancelText: { type: String, required: true },
  confirmText: { type: String, required: true },
  title: { type: String, required: true },
  modelValue: { type: Boolean, required: true },
  loading: { type: Boolean, required: true },
});
</script>

<style scoped>
:deep(.v-card) {
  background-color: rgba(var(--v-theme-surface));
}
</style>
