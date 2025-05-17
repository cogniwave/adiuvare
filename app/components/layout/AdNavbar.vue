<template>
  <v-app-bar color="surface" density="compact" elevation="3">
    <template #title>
      <div class="d-flex align-center justify-space-between">
        <div>
          <v-img src="/assets/images/logo.png" aspect-ratio="1" width="78px" @click="$router.push('/')" />
        </div>

        <span v-if="ready && loggedIn" class="mr-5"> {{ $t("email.greetings") }} {{ user!.name }} </span>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  // import { useNotificationsStore } from "app/stores/notifications.store";

  const $router = useRouter();
  const { loggedIn, user, ready } = useUserSession();

  // const $notifStore = useNotificationsStore();
</script>
