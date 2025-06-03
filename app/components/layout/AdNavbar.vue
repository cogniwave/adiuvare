<template>
  <v-app-bar color="surface" density="compact" elevation="3">
    <template #title>
      <div class="d-flex align-center justify-space-between">
        <div v-if="$vuetify.display.mdAndUp">
          <v-img src="/assets/images/logo.png" aspect-ratio="1" width="78px" @click="$router.push('/')" />
        </div>

        <v-app-bar-nav-icon v-else variant="text" color="default" @click.stop="menuOpen = !menuOpen" />

        <span v-if="ready && loggedIn" class="mr-5"> {{ $t("email.greetings") }} {{ user!.name }} </span>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { useMenu } from "app/store/menu";

  // import { useNotificationsStore } from "app/stores/notifications.store";

  const $router = useRouter();
  const { loggedIn, user, ready } = useUserSession();
  const { menuOpen } = useMenu();

  // const $notifStore = useNotificationsStore();
</script>
