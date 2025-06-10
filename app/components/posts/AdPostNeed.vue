<template>
  <v-tooltip :text="$t(details.description)">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        text-color="white"
        rounded="md"
        label
        variant="flat"
        class="cursor-pointer pr-1"
        :class="$vuetify.display.lgAndUp ? 'ml-2' : 'mr-2'"
        :size="size"
        :prepend-icon="details.icon"
        :color="details.color"
      >
        {{ $t(details.label) }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
  import type { PostNeed } from "shared/types/post";
  import { useNeed } from "app/composables/needs";

  const $props = defineProps({
    need: { type: String as PropType<PostNeed>, required: true },
    size: { type: String, default: "small" },
  });

  const { getNeedDetails } = useNeed();

  const details = ref(getNeedDetails($props.need));
</script>
