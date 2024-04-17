<template>
  <v-navigation-drawer
    v-if="authed"
    v-model:model-value="$notifStore.visible"
    temporary
    location="right"
  >
    <template v-slot:prepend>
      <v-list-item
        v-if="$notifStore.notifications === null"
        title="Something went wrong trying to fetch notifications"
      />

      <v-list-item
        v-else-if="!$notifStore.notifications.length"
        title="You have no notifications"
      />

      <template v-else>
        <v-list-item
          v-for="(n, i) of $notifStore.notifications"
          :key="i"
          lines="two"
          prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
          subtitle="Logged in"
          :title="i"
        />
      </template>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useNotificationsStore } from "@/stores/notifications.store";

const { status } = useAuth();
const $notifStore = useNotificationsStore();

const authed = computed(() => status.value === "authenticated");

watch(
  () => status,
  () => authed.value && $notifStore.getNotifications(),
  { immediate: true },
);
</script>
