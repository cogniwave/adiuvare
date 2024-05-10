<template>
  <v-text-field
    placeholder="E.g.: 18/05/2023"
    prepend-icon="fa-solid fa-calendar-day"
    readonly
    validate-on="input lazy"
    :model-value="date"
    :rules="[required($t), validDate($t)]"
  />

  <suspense>
    <v-date-picker
      v-model:model-value="proxyDate"
      landscape
      color="primary"
      class="mx-auto mt-5 bg-white"
      hide-header
      width="512px"
      @update:model-value="onProxyChange"
    />
  </suspense>

  <div v-if="date" class="time-group mt-2">
    <qa-post-schedule-recurring-time :model-value="times" @update:model-value="onTimesUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { Post, ScheduleTime, SpecificSchedule } from "@/types/post";
import type { Dayjs } from "@/services/dayjs.service";

import dayjs from "@/services/dayjs.service";
import { required, validDate } from "@/utils/validators";
import QaPostScheduleRecurringTime from "./QaPostScheduleRecurringTime.vue";
import { getNewGroupTimes } from "@/utils/scheduling";

const { currPost } = usePosts<Post>();

const date = ref((currPost.value.schedule?.payload as SpecificSchedule).day || "");
const proxyDate = ref<Dayjs>(date.value ? dayjs(date.value) : dayjs());
const times = ref<ScheduleTime[]>(
  (currPost.value.schedule?.payload as SpecificSchedule).times || [],
);

const onUpdate = (payload: SpecificSchedule) => {
  currPost.value = {
    ...currPost.value,
    schedule: { type: "recurring", payload },
  };
};

const onTimesUpdate = (payload: ScheduleTime[]) => {
  times.value = payload;

  onUpdate({
    day: dayjs(date.value, "DD/MM/YYYY").toString(),
    times: payload,
  });
};

const onProxyChange = (proxy: Dayjs) => {
  date.value = proxy.format("DD/MM/YYYY");

  if (!times.value.length) {
    times.value = [getNewGroupTimes()];
    onUpdate({
      day: dayjs(date.value, "DD/MM/YYYY").toString(),
      times: times.value,
    });
  }
};
</script>

<style lang="scss" scoped>
.time-group {
  margin: auto;
  width: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
