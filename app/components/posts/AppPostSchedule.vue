<template>
  <v-input prepend-icon="fa-solid fa-calendar-days" class="mt-10">
    <v-label class="mr-2"> {{ t("form.post.schedule.title") }} </v-label>

    <v-btn-toggle
      v-model:model-value="scheduleType"
      divided
      color="secondary"
      density="compact"
      class="ml-auto"
      @update:model-value="updateScheduleType"
    >
      <v-tooltip :text="t('form.post.schedule.anytime')">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            density="compact"
            rounded="0"
            size="x-small"
            value="anytime"
            @update:model-value="scheduleType = 'anytime'"
          >
            {{ t("form.post.schedule.anytime") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="t('form.post.schedule.specific')">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            density="compact"
            rounded="0"
            size="x-small"
            value="specific"
            @update:model-value="scheduleType = 'specific'"
          >
            {{ t("form.post.schedule.specific") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="t('form.post.schedule.recurring')">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            density="compact"
            rounded="0"
            size="x-small"
            value="recurring"
            @update:model-value="scheduleType = 'recurring'"
          >
            {{ t("form.post.schedule.recurring") }}
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-toggle>
  </v-input>

  <div v-if="scheduleType === 'recurring'" class="text-center">
    <app-post-schedule-recurring-selector />
  </div>

  <div v-else-if="scheduleType === 'specific'" class="text-center">
    <app-post-schedule-specific-selector />
  </div>
</template>

<script setup lang="ts">
  import { usePosts } from "app/store/posts";
  import AppPostScheduleRecurringSelector from "./AppPostScheduleRecurringSelector.vue";
  import AppPostScheduleSpecificSelector from "./AppPostScheduleSpecificSelector.vue";
  import type { Post, ScheduleType } from "shared/types/post";

  const { currPost, updateScheduleType } = usePosts<Post>();
  const { t } = useI18n();

  const scheduleType = ref<ScheduleType>(currPost.value?.schedule?.type || "anytime");
</script>
