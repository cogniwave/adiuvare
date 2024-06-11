<template>
  <v-app-bar color="white" density="compact" elevation="0">
    <template v-slot:title>
      <v-row no-gutters>
        <v-col cols="1">
          <v-img src="/assets/logo.png" aspect-ratio="1" width="78px" @click="$router.push('/')" />
        </v-col>

        <v-col md="3" offset-md="1" offset-lg="2" cols="6" offset="2" align-self="center">
          <div class="d-flex w-100 align-center">
            <v-btn v-if="showCreateButton" size="small" icon class="ml-2" @click="toggleMenu">
              <v-icon size="large">fa-solid fa-plus</v-icon>
            </v-btn>
          </div>
        </v-col>

        <template v-if="mdAndUp">
          <v-col cols="3" align-self="center" align="end">
            <v-btn
              v-if="showCreateButton"
              size="small"
              rounded="md"
              variant="plain"
              class="ml-auto btn-contact"
              to="/posts/new"
            >
              {{ t("posts.submit") }}
            </v-btn>
          </v-col>

          <v-col cols="3" md="4" lg="3" align-self="center" align="end">
            <!-- todo: readd when we actually have notifications -->
            <!-- <v-btn
              v-if="authed"
              class="text-none"
              stacked
              size="x-small"
              @click="$notifStore.toggleNotifications"
            >
              <v-badge
                v-if="$notifStore.notifications.length"
                :content="$notifStore.badge"
                label="notifications"
              >
                <v-icon size="x-small"> fa-solid fa-bell </v-icon>
              </v-badge>

              <v-icon v-else size="x-small"> fa-solid fa-bell </v-icon>
            </v-btn> -->

            <ad-profile-menu />
          </v-col>
        </template>

        <v-col v-else align="end" align-self="center">
          <v-btn size="small" icon @click="toggleMenu">
            <v-icon size="large">fa-solid fa-bars</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
// import { useNotificationsStore } from "@/stores/notifications.store";
import { useRouter } from "#imports";
import { useDisplay } from "vuetify";

import { useAuth } from "@/store/auth";
import { useMenu } from "@/store/menu";

const { menuOpen } = useMenu();
const { loggedIn, data } = useAuth();
const { t } = useI18n();
const $router = useRouter();
const { mdAndUp } = useDisplay();

// const $notifStore = useNotificationsStore();
const showCreateButton = computed(() => loggedIn && data.value?.type === "org");

const toggleMenu = () => (menuOpen.value = !menuOpen.value);
</script>
