<template>
  <v-input prepend-icon="fa-solid fa-address-book">
    <v-label class="mr-2"> {{ t("form.contacts.title") }} </v-label>

    <v-btn-toggle
      v-model:model-value="scheduleType"
      divided
      color="primary"
      density="compact"
      class="ml-auto"
    >
      <!-- <v-tooltip :text="t('form.post.schedule.anytime')">
      <template v-slot:activator="{ props }"> -->
      <v-btn size="x-small" value="anytime" @update:model-value="scheduleType = 'anytime'">
        {{ t("form.post.schedule.anytime") }}
      </v-btn>
      <!-- </template>
    </v-tooltip> -->

      <!-- <v-tooltip :text="t('form.post.schedule.specific')">
      <template v-slot:activator="{ props }"> -->
      <v-btn size="x-small" value="specific" @update:model-value="scheduleType = 'specific'">
        {{ t("form.post.schedule.specific") }}
      </v-btn>
      <!-- </template>
    </v-tooltip> -->

      <!-- <v-tooltip :text="t('form.post.schedule.recurring')">
      <template v-slot:activator="{ props }"> -->
      <v-btn size="x-small" value="recurring" @update:model-value="scheduleType = 'recurring'">
        {{ t("form.post.schedule.recurring") }}
      </v-btn>
      <!-- </template>
     </v-tooltip> -->
    </v-btn-toggle>
  </v-input>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Post, ScheduleType } from "@/types/post";

const { currPost } = usePosts<Post>();
const { t } = useI18n();

const scheduleType = ref<ScheduleType>(currPost.value?.schedule.type || "anytime");
</script>
