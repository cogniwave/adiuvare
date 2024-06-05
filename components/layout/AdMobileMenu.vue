<template>
  <v-navigation-drawer v-model:model-value="menuOpen" temporary location="bottom">
    <v-list nav>
      <template v-if="loggedIn">
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
      </template>

      <template v-else>
        <v-list-item
          :title="t('login.title')"
          append-icon="fa-solid fa-arrow-right-to-bracket"
          to="/login"
        />

        <v-list-item
          :title="t('register.title')"
          append-icon="fa-solid fa-user-plus"
          to="/register"
        />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useMenu } from "@/store/menu";
import { useAuth } from "@/store/auth";

const { logout, loggedIn } = useAuth();
const { t } = useI18n();
const { menuOpen } = useMenu();
</script>
