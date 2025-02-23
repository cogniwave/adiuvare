<template>
  <v-chip
    text-color="white"
    class="cursor-pointer"
    variant="flat"
    rounded="lg"
    density="comfortable"
    :prepend-icon="details.icon"
    :color="details.color"
    @click.prevent="emit('click', need)"
    @click:close.prevent="emit('click:remove', need)"
  >
    {{ t(details.label) }}
  </v-chip>
</template>

<script setup lang="ts">
  import type { PostNeed } from "shared/types/post";

  const props = defineProps({
    need: { type: String as PropType<PostNeed>, required: true },
  });

  const emit = defineEmits<{
    (e: "click" | "click:remove", payload: PostNeed): void;
  }>();

  const { getNeedDetails } = useNeed();
  const { t } = useI18n();

  const details = ref(getNeedDetails(props.need));
</script>
