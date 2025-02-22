<template>
  <v-navigation-drawer v-if="loggedIn" v-model:model-value="visible" temporary location="right">
    <template #prepend>
      <v-list-item v-if="notifications === null" title="Something went wrong trying to fetch notifications" />

      <v-list-item v-else-if="!notifications.length" title="You have no notifications" />

      <template v-else>
        <v-list-item
          v-for="(n, i) of notifications"
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
  import { useNotifications } from "app/store/notification";

  const { loggedIn } = useUserSession();
  const { notifications, visible } = useNotifications();

  // watch(
  //   () => status,
  //   () => loggedIn.value && $notifStore.getNotifications(),
  //   { immediate: true },
  // );
</script>
