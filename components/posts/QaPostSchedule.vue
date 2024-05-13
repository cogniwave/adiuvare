<template>
  <v-input prepend-icon="fa-solid fa-calendar-days">
    <v-label class="mr-2"> {{ $t("form.post.schedule.title") }} </v-label>

    <v-btn-toggle
      v-model:model-value="scheduleType"
      divided
      color="primary"
      density="compact"
      class="ml-auto"
    >
      <v-tooltip :text="$t('form.post.schedule.anytime')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="x-small"
            value="anytime"
            @update:model-value="scheduleType = 'anytime'"
          >
            {{ $t("form.post.schedule.anytime") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="$t('form.post.schedule.specific')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="x-small"
            value="specific"
            @update:model-value="scheduleType = 'specific'"
          >
            {{ $t("form.post.schedule.specific") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="$t('form.post.schedule.recurring')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            size="x-small"
            value="recurring"
            @update:model-value="scheduleType = 'recurring'"
          >
            {{ $t("form.post.schedule.recurring") }}
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-toggle>
  </v-input>

  <div v-if="scheduleType === 'recurring'" class="text-center">
    <qa-post-schedule-recurring-selector />
  </div>

  <div v-else-if="scheduleType === 'specific'" class="text-center">
    <qa-post-schedule-specific-selector />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Post, ScheduleType } from "@/types/post";

import QaPostScheduleRecurringSelector from "./QaPostScheduleRecurringSelector.vue";
import QaPostScheduleSpecificSelector from "./QaPostScheduleSpecificSelector.vue";

const { currPost } = usePosts<Post>();

const scheduleType = ref<ScheduleType>(currPost.value?.schedule?.type || "anytime");
</script>
