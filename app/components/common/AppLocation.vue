<template>
  <app-location-chip v-for="location in visibleLocations" :key="location" :location="location" />

  <v-menu v-if="leftoverLocations.length" open-on-hover>
    <template #activator="{ props }">
      <span v-bind="props">
        <v-chip label variant="outlined" color="secondary" size="small"> +{{ leftoverLocations.length }} </v-chip>
      </span>
    </template>

    <v-list density="compact" class="pt-1 pb-2">
      <v-list-item v-for="location in leftoverLocations" :key="location" class="pl-2 pr-2">
        <app-location-chip :location="location" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  import AppLocationChip from "app/components/common/AppLocationChip.vue";

  import type { PropType } from "vue";

  const $props = defineProps({
    locations: { type: Array as PropType<string[]>, required: true },
  });

  const { mdAndUp } = useDisplay();

  const numVisibleLocations = computed(() => (mdAndUp.value ? 3 : 1));

  const visibleLocations = ref<string[]>($props.locations.slice(0, numVisibleLocations.value));
  const leftoverLocations = ref<string[]>($props.locations.slice(numVisibleLocations.value));
</script>
