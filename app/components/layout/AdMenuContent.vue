<template>
  <template v-if="canCreatePost">
    <v-list-item :title="$t('posts.submit')" to="/posts/new" prepend-icon="fa-passport" />

    <v-divider class="my-1" />
  </template>

  <v-list-item :title="$t('menu.home')" to="/" prepend-icon="fa-home" />

  <v-list-item
    :title="$t('orgs.title')"
    :active="$route.path.includes('organizations')"
    to="/organizations"
    prepend-icon="fa-building"
  />

  <v-divider class="my-1" />

  <template v-if="loggedIn">
    <v-list-item
      :title="$t('nav.account')"
      :active="$route.path.includes('account')"
      to="/account"
      prepend-icon="fa-cog"
    />

    <v-list-item
      :title="$t('nav.profile')"
      :active="$route.path.includes('profile')"
      to="/profile"
      prepend-icon="fa-user"
    />

    <v-list-item :title="$t('nav.logout')" prepend-icon="fa-right-from-bracket" @click="logout" />
  </template>

  <template v-else>
    <v-list-item
      :title="$t('login.title')"
      :active="$route.path.includes('login')"
      to="/login"
      prepend-icon="fa-right-to-bracket"
    />

    <v-list-item
      :title="$t('register.title')"
      :active="$route.path.includes('register')"
      to="/register"
      prepend-icon="fa-user-plus"
    />
  </template>
</template>

<script setup lang="ts">
  import { useNotify } from "app/store/notify";
  import { useAuthContext } from "app/store/authContext";

  const { clear, loggedIn } = useUserSession();
  const { notifySuccess } = useNotify();
  const { t } = useI18n();
  const { canCreatePost } = useAuthContext();

  const logout = () => {
    clear();
    navigateTo("/");
    notifySuccess(t("logoutSuccess"));
  };
</script>
