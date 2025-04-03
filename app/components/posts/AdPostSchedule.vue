<template>
  <v-input prepend-icon="fa-solid fa-calendar-days">
    <v-label class="mr-2"> {{ t("form.post.schedule.title") }} </v-label>

    <v-btn-toggle
      v-model:model-value="scheduleType"
      divided
      color="primary"
      density="compact"
      class="ml-auto"
      @update:model-value="updateScheduleType"
    >
      <v-tooltip :text="t('form.post.schedule.anytime')">
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" value="anytime">
            {{ t("form.post.schedule.anytime") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="t('form.post.schedule.specific')">
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" value="specific">
            {{ t("form.post.schedule.specific") }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip :text="t('form.post.schedule.recurring')">
        <template #activator="{ props }">
          <v-btn v-bind="props" size="x-small" value="recurring">
            {{ t("form.post.schedule.recurring") }}
          </v-btn>
        </template>
      </v-tooltip>
    </v-btn-toggle>
  </v-input>

  <div v-if="scheduleType === 'recurring'" class="text-center">
    <ad-post-schedule-recurring-selector />
  </div>

  <div v-else-if="scheduleType === 'specific'" class="text-center">
    <ad-post-schedule-specific-selector />
  </div>
</template>

<script setup lang="ts">
  import { usePosts } from "app/store/posts";
  import AdPostScheduleRecurringSelector from "./AdPostScheduleRecurringSelector.vue";
  import AdPostScheduleSpecificSelector from "./AdPostScheduleSpecificSelector.vue";
  import type { Post, ScheduleType } from "shared/types/post";

  const { currPost, updateScheduleType } = usePosts<Post>();
  const { t } = useI18n();

  const scheduleType = ref<ScheduleType>(currPost.value?.schedule?.type || "anytime");
</script>
