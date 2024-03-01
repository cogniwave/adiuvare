<template>
  <v-radio-group
    v-model:model-value="scheduleType"
    inline
    class="mt-3"
    label="Horário"
  >
    <v-radio label="Qualquer altura" value="anytime" />
    <v-radio label="Dia e hora especifica" value="specific" />
    <v-radio label="Horário recurrente" value="recurring" />
  </v-radio-group>

  <div v-if="scheduleType === 'recurring'" class="q-mx-auto text-center">
    <qa-post-schedule-recurring-selector />
  </div>

  <div v-if="scheduleType === 'specific'" class="q-mx-auto text-center">
    <qa-post-schedule-specific-selector />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { ScheduleType } from "@/components/models";

import QaPostScheduleRecurringSelector from "./QaPostScheduleRecurringSelector.vue";
import QaPostScheduleSpecificSelector from "./QaPostScheduleSpecificSelector.vue";

const scheduleType = ref<ScheduleType>("anytime");
</script>
