<template>
  <v-tooltip location="top" :text="$t(details.description)">
    <template v-slot:activator="{ props }">
      <v-chip
        v-bind="props"
        text-color="white"
        rounded="md"
        label
        size="x-small"
        variant="text"
        class="cursor-pointer ml-1 pr-1"
        :prepend-icon="details.icon"
        :color="details.color"
      >
        {{ $t(details.label) }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { PropType } from "vue";
import type { PostCategory } from "@/types/post";

const props = defineProps({
  need: { type: String as PropType<PostCategory>, required: true },
});

const { getNeedDetails } = useNeed();

const details = ref(getNeedDetails(props.need));
</script>
