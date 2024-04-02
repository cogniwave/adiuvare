<template>
  <v-layout>
    <v-app-bar color="white" density="compact" elevation="0">
      <template v-slot:title>
        <ClientOnly fallback-tag="a">
          <router-link to="/">
            <v-img
              src="../public/logo.png"
              aspect-ratio="1"
              width="48px"
              eager
            />
          </router-link>
        </ClientOnly>
      </template>

      <template v-slot:append>
        <ClientOnly fallback-tag="span" :fallback="$t('loading')">
          <v-icon
            v-if="status === 'authenticated'"
            size="x-small"
            @click="notifsOpen = !notifsOpen"
          >
            fa-regular fa-bell
          </v-icon>

          <qa-profile-menu />
        </ClientOnly>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-if="status === 'authenticated'"
      v-model:model-value="notifsOpen"
      temporary
      location="right"
    >
      <template v-slot:prepend>
        <v-list-item
          v-if="notifications === null"
          title="Something went wrong trying to fetch notifications"
        />

        <v-list-item
          v-else-if="!notifications.length"
          title="You have no notifications"
        />

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

    <qa-snackbar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import type { Notification } from "@/types/notification";

import { getNotifications } from "@/services/notifications.service";

const { status } = useAuth();

const notifsOpen = ref(false);
const notifications = ref<Notification[] | null>([]);

watch(
  () => status,
  async (status) => {
    if (status.value === "authenticated") {
      try {
        notifications.value = await getNotifications();
      } catch (err) {
        notifications.value = null;
      }
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.v-toolbar {
  box-shadow: 0px 1px 20px 0px #e8e8e8 !important;

  .v-toolbar__content {
    img {
      width: 48px;
    }
    a {
      color: var(--v-theme-base) !important;
      text-decoration: none;
    }
  }
}

span {
  cursor: pointer;
}

:deep(.v-application) {
  padding-top: 20px;
}
</style>
