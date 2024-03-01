<template>
  <v-tooltip text="Segunda-feira" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['monday'] ? 'flat' : 'outlined'"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('monday')"
      >
        S
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Terça-feira" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['tuesday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('tuesday')"
      >
        T
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Quarta-feira" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['wednesday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('wednesday')"
      >
        Q
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Quinta-feira" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['thursday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('thursday')"
      >
        Q
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Sexta-feira" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['friday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('friday')"
      >
        S
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Sábado" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['saturday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('saturday')"
      >
        S
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip text="Domingo" location="top">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['sunday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="48"
        rounded="xl"
        color="primary"
        @click="toggleDay('sunday')"
      >
        D
      </v-btn>
    </template>
  </v-tooltip>

  <br />
  <br />

  <div
    v-for="({ day, times }, idx) in timeGroups"
    :key="day"
    :class="{ 'mt-2': idx !== 0 }"
    class="time-group"
    transition="fade-transition"
  >
    <span>{{ toHumanDay(day) }}</span>

    <qa-post-schedule-recurring-time
      :model-value="times"
      @update:model-value="onTimesUpdate(day, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import type { PropType } from "vue";
import type {
  Day,
  RecurringSchedule,
  ScheduleTime,
  RecurringScheduleTimeGroup,
} from "@/components/models";

import QaPostScheduleRecurringTime from "./QaPostScheduleRecurringTime.vue";
import { getNewGroupTimes } from "@/utils/scheduling";
import { toHumanDay } from "@/utils/scheduling";
import { usePostsStore } from "@/stores/posts";

// setup

const props = defineProps({
  modelValue: {
    type: Object as PropType<RecurringSchedule>,
    default: () => ({
      monday: [getNewGroupTimes()],
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    }),
  },
});

const $store = usePostsStore();

// data
const selected = ref<RecurringSchedule>(props.modelValue);

const timeGroups = ref<RecurringScheduleTimeGroup[]>();

// hooks
onBeforeMount(() => setupTimeGroups(selected.value));

// methods

const toggleDay = (day: Day) => {
  const updated = { ...selected.value };

  if (!selected.value[day]) {
    updated[day] = [getNewGroupTimes()];
  } else {
    updated[day] = null;
  }

  setupTimeGroups(updated);

  selected.value = updated;

  onUpdate(updated);
};

const onTimesUpdate = (day: Day, newTimes: ScheduleTime[]) => {
  selected.value[day] = newTimes;
  onUpdate(selected.value);
};

const setupTimeGroups = (updated: RecurringSchedule) => {
  timeGroups.value = Object.entries(updated).reduce((result, [key, times]) => {
    if (times) {
      result.push({ day: key as Day, times });
    }

    return result;
  }, [] as RecurringScheduleTimeGroup[]);
};

const onUpdate = (payload: RecurringSchedule) => {
  $store.updatePost("schedule", {
    type: "recurring",
    payload: Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== null),
    ) as RecurringSchedule,
  });
};
</script>

<style lang="scss" scoped>
.time-group {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  span {
    width: 150px;
    display: inline-block;
    text-align: left;
    margin-top: 10px;
  }
}
</style>
