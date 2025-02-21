<template>
  <v-text-field
    placeholder="E.g.: 18/05/2023"
    prepend-icon="fa-solid fa-calendar-day"
    readonly
    validate-on="input lazy"
    :model-value="date"
    :rules="[required(t), validDate(t), ...(!initValue ? [futureDate(t)] : [])]"
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
    <ad-post-schedule-recurring-time :model-value="times" @update:model-value="onTimesUpdate" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import dayjs, { type Dayjs } from "#shared/services/dayjs.service";
  import { required, validDate, futureDate } from "@/utils/validators";
  import AdPostScheduleRecurringTime from "./AdPostScheduleRecurringTime.vue";
  import { getNewGroupTimes } from "@/utils/scheduling";
  import { usePosts } from "@/store/posts";
  import type { Post, ScheduleTime, SpecificSchedule } from "~~/shared/types/post";

  const { currPost } = usePosts<Post>();
  const { d, t } = useI18n();

  const initValue = ref((currPost.value.schedule?.payload as SpecificSchedule).day);

  const date = ref(d((currPost.value.schedule?.payload as SpecificSchedule).day || ""));
  const proxyDate = ref<Dayjs>(date.value ? dayjs(date.value) : dayjs());
  const times = ref<ScheduleTime[]>((currPost.value.schedule?.payload as SpecificSchedule).times || []);

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
    date.value = d(proxy.toISOString());

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
