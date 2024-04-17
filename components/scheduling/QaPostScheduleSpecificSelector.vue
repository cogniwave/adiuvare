<template>
  <v-overlay v-model:model-value="calendarVisible" location-strategy="connected">
    <template #activator="{ props }">
      <form-qa-input
        v-bind="props"
        :model-value="date"
        placeholder="E.g.: 18/05/2023"
        icon="fa-solid fa-calendar-day"
        readonly
        :rules="[required, validDate]"
      />
    </template>

    <v-date-picker
      :model-value="proxyDate"
      color="primary"
      hide-header
      show-adjacent-months
      style="width: 512px"
      :min="minDate"
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
import { usePostsStore } from "@/stores/posts.store";

const $store = usePostsStore();

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
  $store.updatePost("schedule", { type: "recurring", payload });
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
@/stores/posts.store
