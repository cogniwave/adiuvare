<template>
  <v-chip
    text-color="white"
    class="cursor-pointer"
    variant="outlined"
    :prepend-icon="details.icon"
    :color="details.color"
    :closable="closable"
    @click.prevent="emit('click', need)"
    @click:close.prevent="emit('click:remove', need)"
  >
    {{ details.label }}
  </v-chip>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { PropType } from "vue";
import type { PostCategory } from "@/types/post";

const props = defineProps({
  need: { type: String as PropType<PostCategory>, required: true },
  closable: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "click" | "click:remove", payload: PostCategory): void;
}>();

const { getNeedDetails } = useNeed();

const details = ref(getNeedDetails(props.need));
</script>
