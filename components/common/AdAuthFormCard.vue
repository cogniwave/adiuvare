<template>
  <v-card class="bg-white">
    <v-card-title class="bg-primary">
      <h2 class="text-h5 text-white">{{ title }}</h2>
    </v-card-title>

    <v-card-item v-if="!loading">
      <v-form
        v-if="showForm"
        ref="form"
        class="px-4 pt-4"
        validate-on="submit lazy"
        @submit.prevent="submit"
      >
        <slot name="form"></slot>

        <v-divider class="mt-4" />

        <v-card-actions class="px-5 d-flex align-center justify-end">
          <slot name="actions"></slot>
        </v-card-actions>
      </v-form>

      <div v-else class="py-5">
        <slot name="content"></slot>
      </div>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import type { VForm } from "vuetify/lib/components/index.mjs";

defineProps({
  title: { type: String, required: true },
  showForm: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
});

const $emit = defineEmits(["submit"]);

const form = ref<VForm>();

const submit = () => $emit("submit");

defineExpose({
  validate: async () => {
    if (!form.value) {
      return { valid: false };
    }

    return await form.value.validate();
  },
});
</script>

<style lang="scss" scoped>
:deep(p) {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}

a {
  transition: 0.2s;
  opacity: 0.8;

  &:hover {
    transition: 0.2s;
    opacity: 1;
  }
}
</style>
