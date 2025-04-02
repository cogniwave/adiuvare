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
  import dayjs, { type Dayjs } from "shared/services/dayjs.service";
  import { required, validDate, futureDate } from "app/utils/validators";
  import AdPostScheduleRecurringTime from "./AdPostScheduleRecurringTime.vue";
  import { getNewGroupTimes } from "app/utils/scheduling";
  import { usePosts } from "app/store/posts";
  import { ScheduleType, type Post, type ScheduleTime, type SpecificSchedule } from "shared/types/post";

  const { currPost } = usePosts<Post>(ScheduleType.SPECIFIC);
  const { d, t } = useI18n();

  const initValue = ref(currPost.value.schedule?.payload?.day || "");
  const date = ref(d(currPost.value.schedule?.payload?.day || new Date()));
  const proxyDate = ref<Dayjs>(date.value ? dayjs(date.value) : dayjs());
  const times = ref<ScheduleTime[]>(currPost.value.schedule?.payload.times || []);

  const onUpdate = (payload: SpecificSchedule) => {
    currPost.value = {
      ...currPost.value,
      schedule: { type: ScheduleType.SPECIFIC, payload },
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
