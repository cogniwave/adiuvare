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

          <v-col v-show="isFeed" cols="3" offset="2" align-self="center">
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

          <v-col v-show="isFeed" cols="3" align-self="center" align="end">
            <v-btn
              v-if="authed && $sessionStore.isOrg"
              size="small"
              rounded="md"
              variant="plain"
              class="ml-auto btn-contact"
              @click="$postsStore.openDialog()"
            >
              {{ $t("posts.submit") }}
            </v-btn>
          </v-col>

          <v-col cols="3" align-self="center" align="end">
            <ClientOnly fallback-tag="span" :fallback="$t('loading')">
              <!-- todo: readd when we actually have notifications -->
              <!-- <v-btn
                v-if="authed"
                class="text-none"
                stacked
                size="x-small"
                @click="notifsOpen = !notifsOpen"
              >
                <v-badge v-if="notifications?.length" :content="notifBadge" label="notifications">
                  <v-icon size="x-small"> fa-solid fa-bell </v-icon>
                </v-badge>

                <v-icon v-else size="x-small"> fa-solid fa-bell </v-icon>
              </v-btn> -->

              <qa-profile-menu />
            </ClientOnly>
          </v-col>
        </v-row>
      </template>
    </v-app-bar>

    <!-- todo: add when there's messages and stuffs -->
    <!-- <v-navigation-drawer v-if="authed" v-model:model-value="notifsOpen" temporary location="right">
      <template v-slot:prepend>
        <v-list-item
          v-if="notifications === null"
          title="Something went wrong trying to fetch notifications"
        />

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
    </v-navigation-drawer> -->

    <qa-snackbar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
// import type { Notification } from "@/types/notification";

import { useRoute } from "vue-router";
// import { getNotifications } from "@/services/notifications.service";
import { useSessionStore } from "@/stores/session.store";
import { usePostsStore } from "@/stores/posts.store";

const { status } = useAuth();
const $sessionStore = useSessionStore();
const $postsStore = usePostsStore();
const $route = useRoute();

// const notifsOpen = ref(false);
// const notifications = ref<Notification[]>([]);
const query = ref("");

const authed = computed(() => status.value === "authenticated");
const isFeed = computed(() => $route.path === "/");

// const notifBadge = computed<string>(() => {
//   if (notifications.value) {
//     return notifications.value.length > 9 ? "9+" : String(notifications.value.length);
//   }

//   return "0";
// });

// todo: readd when we actually have something to notify about
// watch(
//   () => status,
//   async () => {
//     if (authed.value) {
//       try {
//         notifications.value = await getNotifications();
//       } catch (err) {
//         notifications.value = [];
//       }
//     }
//   },
//   { immediate: true },
// );

const search = () => console.log("searching");
</script>

<style scoped lang="scss">
:deep(.v-toolbar) {
  box-shadow: 0px 1px 20px 0px #e8e8e8 !important;

  .v-toolbar__content {
    .v-toolbar-title {
      margin-inline-end: 16px;
    }

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
