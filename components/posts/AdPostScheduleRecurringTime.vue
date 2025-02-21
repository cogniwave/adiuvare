<template>
  <div class="w-100 item-group">
    <template v-for="(time, idx) in times" :key="time.id">
      <div class="picker-group mb-3">
        <ad-time-picker
          :model-value="time.start"
          :error="time.error"
          @update:model-value="onChange($event, 'start', time)"
        />

        <span> - </span>

        <ad-time-picker
          :model-value="time.end"
          :error="time.error"
          @update:model-value="onChange($event, 'end', time)"
        />

        <div class="button-group ml-3">
          <v-tooltip
            :text="t('form.post.schedule.addRecurring')"
            location="bottom"
            close-on-content-click
            close-delay="0"
          >
            <template #activator="{ props }">
              <v-btn
                v-if="idx > 0"
                v-bind="props"
                rounded="xl"
                class="mr-1"
                density="compact"
                variant="tonal"
                size="xs"
                icon="fa-solid fa-circle-minus"
                color="primary"
                @click="onRemove(time.id)"
              />
            </template>
          </v-tooltip>

          <v-tooltip
            :text="t('form.post.schedule.removeRecurring')"
            location="bottom"
            close-on-content-click
            close-delay="0"
          >
            <template #activator="{ props }">
              <v-btn
                v-show="idx === times.length - 1"
                v-bind="props"
                rounded="xl"
                density="compact"
                variant="tonal"
                size="xs"
                icon="fa-solid fa-circle-plus"
                color="primary"
                @click="onAdd"
              />
            </template>
          </v-tooltip>
        </div>
      </div>

      <small v-if="time.error" class="text-error text-start d-block mt-2">
        {{ t("errors.post.endHourHigherThanStart") }}
      </small>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import type { ScheduleTime } from "@/types/post";

  import AdTimePicker from "./AdTimePicker.vue";
  import { getNewGroupTimes } from "@/utils/scheduling";

  const $props = defineProps({
    modelValue: { type: Array<ScheduleTime>, required: true },
  });

  const $emit = defineEmits<{
    (e: "update:model-value", payload: ScheduleTime[]): void;
  }>();

  const { t } = useI18n();

  const times = ref<ScheduleTime[]>($props.modelValue);

  watch(
    () => $props.modelValue,
    (t) => (times.value = t),
  );

  const onAdd = () => {
    times.value = [...times.value, getNewGroupTimes()];

    $emit("update:model-value", times.value);
  };

  const onRemove = (id: string) => {
    times.value = times.value.filter((t) => t.id !== id);
    $emit("update:model-value", times.value);
  };

  const onChange = (val: string, field: "start" | "end", item: ScheduleTime) => {
    const validateTime = ([hour1, minute1]: number[], [hour2, minute2]: number[]) => {
      return hour1! > hour2! || (hour1 === hour2 && minute1! >= minute2!);
    };

    const newTime = val.split(":").map((v) => Number(v));

    if (field === "start") {
      // check if start time is lower than end time
      const currTime = item.end.split(":").map((v) => Number(v));

      item.error = validateTime(newTime, currTime);
      item.start = val;
    } else {
      // check if end time is higher than start time
      const currTime = item.start.split(":").map((v) => Number(v));

      item.error = validateTime(currTime, newTime);
      item.end = val;
    }

    times.value = times.value.map((t) => (t.id === item.id ? item : t));

    if (!item.error) {
      $emit("update:model-value", times.value);
    }
  };
</script>

<style lang="scss" scoped>
  .item-group {
    .picker-group {
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        display: inline-block;
        width: 15%;
      }

      &:first-child {
        .button-group {
          padding-left: 18px;
        }
      }

      .button-group {
        width: 60px;
        justify-content: flex-start;
        display: flex;
      }
    }
  }
</style>
