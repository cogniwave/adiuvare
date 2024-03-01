<template>
  <v-select
    variant="outlined"
    density="compact"
    class="pl-0 pr-0"
    rounded="4px"
    hide-details="auto"
    v-model:model-value="proxyValue"
    :multiple="multiple"
    :chips="multiple"
    :label="proxyLabel"
    :placeholder="placeholder"
    :error="!!error"
    :error-messages="errMessages"
    :rules="rules"
    @update:model-value="onInputChange"
  >
    <template v-if="slots.append" v-slot:append-inner>
      <slot name="append" />
    </template>

    <template v-slot:prepend-inner>
      <v-icon>{{ icon }}</v-icon>
    </template>

    <template v-slot:message="{ message }">
      <i class="far fa-exclamation-circle" />
      <span v-html="message" class="ml-1" />
    </template>

    <template v-if="slots.chip" v-slot:chip="{ item }">
      <!-- @vue-ignore -->
      <slot name="chip" :item="item" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

import type { PropType } from "vue";
import type { ValidationRule } from "@/types/form";

defineSlots<{
  append(): void;
}>();

const props = defineProps({
  placeholder: { type: String, required: false },
  icon: { type: String, default: null },
  appendIcon: { type: String, default: null },
  label: { type: String, default: "" },
  error: {
    type: [String, Array, Boolean] as PropType<string | string[] | boolean>,
    default: "",
  },
  multiple: { type: Boolean, default: false },
  modelValue: {
    type: [String, Array] as PropType<string[] | string>,
    default: " ",
  },
  type: { type: String, default: "text" },
  required: { type: Boolean, default: false },
  rules: { type: Array as PropType<ValidationRule[]>, default: () => [] },
});

const $emit = defineEmits<{
  (e: "update:model-value", val: string | string[]): void;
  (e: "click:remove-chip", val: string | string[]): void;
}>();

const slots = useSlots();

const proxyValue = ref<string | string[]>("");
const proxyLabel = ref<string>(`${props.label}${props.required ? " *" : ""}`);

const errMessages = computed(() => {
  return typeof props.error === "boolean" ? "" : props.error;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (proxyValue.value !== newVal) {
      proxyValue.value = newVal;
    }
  },
  { immediate: true },
);

const onInputChange = (value: string | string[]) => {
  proxyValue.value = value;
  $emit("update:model-value", value);
};
</script>
