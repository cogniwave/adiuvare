<template>
  <section class="d-flex align-center justify-center h-100 w-100">
    <v-card class="w-75" rounded="lg">
      <v-card-title tag="h2" class="bg-background">
        {{ title }}
      </v-card-title>

      <v-card-item v-if="!loading">
        <v-form
          v-if="showForm"
          ref="form"
          class="px-10 pt-4 mx-auto"
          validate-on="submit lazy"
          @submit.prevent="submit"
        >
          <slot name="form" />

          <v-divider class="mt-4" />

          <v-card-actions class="px-0 d-flex align-center justify-end">
            <slot name="actions" />
          </v-card-actions>
        </v-form>

        <div v-else class="py-5">
          <slot name="content" />
        </div>
      </v-card-item>
    </v-card>
  </section>
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
