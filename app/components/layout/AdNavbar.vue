<template>
  <v-app-bar color="white" density="compact" elevation="0">
    <template #title>
      <v-row no-gutters>
        <v-col cols="1">
          <v-img src="/assets/images/logo.png" aspect-ratio="1" width="78px" @click="$router.push('/')" />
        </v-col>

        <template v-if="mdAndUp">
          <v-col cols="5" offset="6" align-self="center" align="end">
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
  // import { useNotificationsStore } from "app/stores/notifications.store";

  import { useMenu } from "app/store/menu";

  const { menuOpen } = useMenu();
  const $router = useRouter();
  const { mdAndUp } = useDisplay();

  // const $notifStore = useNotificationsStore();

  const toggleMenu = () => (menuOpen.value = !menuOpen.value);
</script>
