<template>
  <v-text-field
    density="compact"
    class="pl-0 pr-0"
    rounded="4px"
    hide-details="auto"
    :variant="variant"
    :model-value="proxyValue"
    :label="proxyLabel"
    :placeholder="placeholder"
    :error="!!error"
    :error-messages="error"
    :rules="rules"
    :type="type"
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
  </v-text-field>
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
  error: { type: [String, Array<string>], default: "" },
  modelValue: { type: String, default: "" },
  type: { type: String, default: "text" },
  required: { type: Boolean, default: false },
  rules: { type: Array as PropType<ValidationRule[]>, default: () => [] },
  variant: {
    type: String as PropType<
      | "outlined"
      | "plain"
      | "filled"
      | "underlined"
      | "solo"
      | "solo-inverted"
      | "solo-filled"
    >,
    default: "outlined",
  },
});

const $emit = defineEmits<{
  (e: "update:model-value" | "change", val: string): void;
}>();

const slots = useSlots();

const proxyValue = ref<string>("");
const proxyLabel = ref<string>(`${props.label}${props.required ? " *" : ""}`);

watch(
  () => props.modelValue,
  (newVal) => {
    if (proxyValue.value !== newVal) {
      proxyValue.value = newVal;
    }
  },
  { immediate: true },
);

const onInputChange = (value: string) => {
  proxyValue.value = value;
  $emit("update:model-value", value);
};
</script>
