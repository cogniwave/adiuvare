<template>
  <v-layout>
    <v-app-bar color="white" density="compact" elevation="0">
      <template v-slot:title>
        <v-row no-gutters>
          <v-col cols="1">
            <ClientOnly fallback-tag="img">
              <v-img
                src="../assets/logo.png"
                aspect-ratio="1"
                width="48px"
                eager
                @click="$router.push('/')"
              />
            </ClientOnly>
          </v-col>

          <v-col cols="3" offset="2" align-self="center">
            <form @submit.prevent="search">
              <v-text-field
                v-model:model-value="query"
                variant="solo"
                flat
                clearable
                append-inner-icon="fa-solid fa-magnifying-glass"
                rounded="lx"
                density="compact"
                hide-details
                :placeholder="$t('filter.placeholder')"
                @click:append-inner="search"
              />
            </form>
          </v-col>

          <v-col cols="3" offset="3" align-self="center" align="end">
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
          </v-col>
        </v-row>
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
const query = ref("");

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

const search = () => console.log("searching");
</script>

<style scoped lang="scss">
.v-toolbar {
  box-shadow: 0px 1px 20px 0px #e8e8e8 !important;

  .v-toolbar__content {
    .v-img {
      cursor: pointer !important;
    }

    a {
      color: var(--v-theme-base) !important;
      text-decoration: none;
    }
  }
}

:deep(.v-application) {
  .v-application__wrap {
    min-height: calc(100dvh - 48px);
  }
}
</style>
