<template>
  <v-radio-group
    v-model:model-value="scheduleType"
    inline
    class="mt-3"
    :label="$t('form.post.schedule.title')"
  >
    <v-radio :label="$t('form.post.schedule.anytime')" value="anytime" />
    <v-radio :label="$t('form.post.schedule.specific')" value="specific" />
    <v-radio :label="$t('form.post.schedule.recurring')" value="recurring" />
  </v-radio-group>

  <div v-if="scheduleType === 'recurring'" class="text-center">
    <qa-post-schedule-recurring-selector />
  </div>

  <div v-if="scheduleType === 'specific'" class="text-center">
    <qa-post-schedule-specific-selector />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { ScheduleType } from "@/types/post";

import QaPostScheduleRecurringSelector from "./QaPostScheduleRecurringSelector.vue";
import QaPostScheduleSpecificSelector from "./QaPostScheduleSpecificSelector.vue";

const scheduleType = ref<ScheduleType>("anytime");
</script>
