<template>
  <v-list class="py-0" bg-color="background">
    <template v-if="loggedIn">
      <v-list-item :title="t('posts.submit')" to="/posts/new" prepend-icon="fa-passport" />

      <v-divider class="my-1" />
    </template>

    <v-list-item :title="t('menu.home')" to="/" prepend-icon="fa-home" />

    <v-list-item :title="t('menu.orgs')" to="/organizations" prepend-icon="fa-building" />

    <v-divider class="my-1" />

    <template v-if="loggedIn">
      <v-list-item :title="t('nav.account')" to="/account" prepend-icon="fa-cog" />

      <v-list-item :title="t('nav.profile')" to="/profile" prepend-icon="fa-user" />

      <v-list-item :title="t('nav.logout')" to="/logout" prepend-icon="fa-right-from-bracket" @click="clear" />
    </template>

    <template v-else>
      <v-list-item :title="t('login.title')" to="/login" prepend-icon="fa-right-to-bracket" />

      <v-list-item :title="t('register.title')" to="/register" prepend-icon="fa-user-plus" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const { clear, loggedIn } = useUserSession();
</script>

<style lang="scss" scoped>
  .v-list-item {
    transition: 200ms;
    margin-top: 4px;
    color: rgb(var(--v-theme-text));
    margin-bottom: 4px;

    &:hover {
      background: rgb(var(--v-theme-accent));
      transition: 200ms;
    }

    &.v-list-item--active {
      background: rgb(var(--v-theme-accent));
      color: rgb(var(--v-theme-text));
    }

    .v-list-item__overlay {
      background: rgb(var(--v-theme-accent));
    }
  }
</style>
