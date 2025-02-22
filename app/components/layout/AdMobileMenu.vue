<template>
  <v-navigation-drawer v-model:model-value="menuOpen" temporary location="bottom">
    <v-list nav>
      <v-list-item :title="t('menu.home')" append-icon="fa-solid fa-house" @click="$router.push('/')" />

      <v-list-item
        :title="t('menu.orgs')"
        append-icon="fa-solid fa-building-ngo"
        @click="$router.push('/organizations')"
      />

      <v-divider />

      <template v-if="loggedIn">
        <template v-if="showCreateButton">
          <v-list-item
            :title="t('posts.submit')"
            append-icon="fa-solid fa-file-lines"
            @click="$router.push('/posts/new')"
          />

          <v-divider />
        </template>

        <v-list-item :title="t('nav.account')" append-icon="fa-solid fa-gear" @click="$router.push('/account')" />

        <v-list-item :title="t('nav.profile')" append-icon="fa-solid fa-user" @click="$router.push('/profile')" />

        <v-list-item :title="t('nav.logout')" append-icon="fa-solid fa-arrow-right-from-bracket" @click="logout" />
      </template>

      <template v-else>
        <v-list-item :title="t('login.title')" append-icon="fa-solid fa-arrow-right-to-bracket" to="/login" />

        <v-list-item :title="t('register.title')" append-icon="fa-solid fa-user-plus" to="/register" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { useMenu } from "app/store/menu";

  const { logout, loggedIn, user } = useUserSession();
  const { t } = useI18n();
  const { menuOpen } = useMenu();

  const showCreateButton = computed(() => loggedIn && data.value?.type === "org");
</script>
