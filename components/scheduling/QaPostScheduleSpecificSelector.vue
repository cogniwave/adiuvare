<template>
  <v-overlay
    v-model:model-value="calendarVisible"
    :open-delay="0"
    :close-delay="0"
    location-strategy="connected"
  >
    <template #activator="{ props }">
      <form-qa-input
        v-bind="props"
        placeholder="E.g.: 18/05/2023"
        icon="fa-solid fa-calendar-day"
        readonly
        validate-on="input lazy"
        :model-value="date"
        :rules="[required, validDate]"
      />
    </template>

    <v-date-picker
      :model-value="proxyDate"
      :min="minDate"
      color="primary"
      hide-header
      show-adjacent-months
      width="512px"
      @update:model-value="onProxyChange"
    >
      <template v-slot:actions>
        <div class="row items-center justify-end q-gutter-sm">
          <v-btn flat @click="calendarVisible = false">
            {{ $t("posts.cancel") }}
          </v-btn>

          <v-btn color="primary" variant="flat" @click="onSave">
            {{ $t("posts.chooseSchedule") }}
          </v-btn>
        </div>
      </template>
    </v-date-picker>
  </v-overlay>

  <div v-if="date" class="time-group mt-2">
    <qa-post-schedule-recurring-time :model-value="times" @update:model-value="onTimesUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { ScheduleTime, SpecificSchedule } from "@/types/post";
import type { Dayjs } from "@/services/dayjs.service";

import dayjs from "@/services/dayjs.service";
import { required, validDate } from "@/utils/validators";
import QaPostScheduleRecurringTime from "./QaPostScheduleRecurringTime.vue";
import { getNewGroupTimes } from "@/utils/scheduling";

const { currPost } = usePosts();

const calendarVisible = ref(false);
const date = ref("");
const proxyDate = ref<Dayjs>(dayjs());
const times = ref<ScheduleTime[]>([]);
const d = new Date();
d.setDate(d.getDate() - 1);
const minDate = ref(d.toISOString());

const onSave = () => {
  date.value = proxyDate.value.format("DD/MM/YYYY");

  if (!times.value.length) {
    times.value = [getNewGroupTimes()];
    onUpdate({
      day: dayjs(date.value, "DD/MM/YYYY"),
      times: times.value,
    });
  }

  calendarVisible.value = false;
};

const onTimesUpdate = (payload: ScheduleTime[]) => {
  times.value = payload;

  onUpdate({
    day: dayjs(date.value, "DD/MM/YYYY"),
    times: payload,
  });
};

const onUpdate = (payload: SpecificSchedule) => {
  currPost.value = {
    ...currPost.value,
    schedule: { type: "recurring", payload },
  };
};

const onProxyChange = (proxy: Dayjs) => {
  proxyDate.value = proxy;
  date.value = proxy.format("DD/MM/YYYY");
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
