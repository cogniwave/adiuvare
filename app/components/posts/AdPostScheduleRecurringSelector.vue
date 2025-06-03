<template>
  <v-tooltip :text="t('form.post.schedule.day.monday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['monday'] ? 'flat' : 'outlined'"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('monday')"
      >
        {{ t("form.post.schedule.day.mondayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.tuesday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['tuesday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('tuesday')"
      >
        {{ t("form.post.schedule.day.tuesdayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.wednesday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['wednesday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('wednesday')"
      >
        {{ t("form.post.schedule.day.wednesdayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.thursday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['thursday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('thursday')"
      >
        {{ t("form.post.schedule.day.thursdayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.friday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['friday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('friday')"
      >
        {{ t("form.post.schedule.day.fridayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.saturday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['saturday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('saturday')"
      >
        {{ t("form.post.schedule.day.saturdayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <v-tooltip :text="t('form.post.schedule.day.sunday')">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :variant="selected['sunday'] ? 'flat' : 'outlined'"
        class="ml-3"
        density="compact"
        size="32"
        rounded="xl"
        color="secondary"
        @click="toggleDay('sunday')"
      >
        {{ t("form.post.schedule.day.sundayShort") }}
      </v-btn>
    </template>
  </v-tooltip>

  <br />
  <br />

  <v-virtual-scroll :items="timeGroups" class="time-group" item-height="264">
    <template #default="{ item }">
      <span>{{ toHumanDay(item.day) }}</span>

      <ad-post-schedule-recurring-time
        :model-value="item.times"
        @update:model-value="onTimesUpdate(item.day, $event)"
      />
    </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts">
  import {
    type Day,
    type RecurringSchedule,
    type ScheduleTime,
    type RecurringScheduleTimeGroup,
    ScheduleType,
  } from "shared/types/post";
  import { usePosts } from "app/store/posts";
  import AdPostScheduleRecurringTime from "./AdPostScheduleRecurringTime.vue";
  import { getNewGroupTimes, toHumanDay } from "app/utils/scheduling";

  // setup

  const $props = defineProps({
    modelValue: {
      type: Object as PropType<RecurringSchedule>,
      default: () => ({
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      }),
    },
  });

  const { currPost } = usePosts<Post>("specific");
  const { t } = useI18n();

  // data
  const selected = ref<RecurringSchedule>($props.modelValue);

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
    currPost.value = {
      ...currPost.value,
      schedule: {
        type: "recurring",
        payload: Object.fromEntries(
          Object.entries(payload).filter(([_, value]) => value !== null),
        ) as RecurringSchedule,
      },
    };
  };
</script>

<style lang="scss" scoped>
  .time-group {
    width: 90%;
    display: block;
    margin: auto;

    span {
      width: 150px;
      display: inline-block;
      text-align: left;
      margin-top: 10px;
    }
  }
</style>
