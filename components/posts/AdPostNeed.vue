<template>
  <v-tooltip :text="t(details.description)">
    <template v-slot:activator="{ props }">
      <v-chip
        v-bind="props"
        text-color="white"
        rounded="md"
        label
        class="cursor-pointer pr-1"
        :class="lgAndUp ? 'ml-2' : 'mr-2'"
        :variant="variant"
        :size="size"
        :prepend-icon="details.icon"
        :color="details.color"
      >
        {{ t(details.label) }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";

import type { PropType } from "vue";
import type { PostCategory } from "@/types/post";

const props = defineProps({
  need: { type: String as PropType<PostCategory>, required: true },
  size: { type: String, default: "x-small" },
  variant: {
    type: String as PropType<"text" | "flat" | "elevated" | "tonal" | "outlined" | "plain">,
    default: "text",
  },
});

const { t } = useI18n();
const { getNeedDetails } = useNeed();
const { lgAndUp } = useDisplay();

const details = ref(getNeedDetails(props.need));
</script>
