<template>
  <template v-if="!loading">
    <v-menu v-if="loggedIn">
      <template v-slot:activator="{ props }">
        <span v-bind="props" class="cursor-pointer ml-5">
          {{ data?.name }}
          <v-icon class="ml-2 mb-1">fa-solid fa-chevron-down</v-icon>
        </span>
      </template>

      <v-list>
        <v-list-item
          :title="t('nav.account')"
          append-icon="fa-solid fa-gear"
          @click="$router.push('/account')"
        />

        <v-list-item
          :title="t('nav.profile')"
          append-icon="fa-solid fa-user"
          @click="$router.push('/profile')"
        />

        <v-list-item
          :title="t('nav.logout')"
          append-icon="fa-solid fa-arrow-right-from-bracket"
          @click="logout"
        />
      </v-list>
    </v-menu>

    <v-btn v-else variant="plain" to="/login"> {{ t("login.title") }} </v-btn>
  </template>
</template>

<script setup lang="ts">
import { useAuth } from "@/store/auth";

const $router = useRouter();
const { logout, loggedIn, data, loading } = useAuth();
const { t } = useI18n();
</script>
