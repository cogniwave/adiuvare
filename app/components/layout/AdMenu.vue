<template>
  <v-list bg-color="transparent" class="menu-list">
    <template v-if="ready">
      <template v-if="loggedIn">
        <v-list-item :title="t('posts.submit')" to="/posts/new" prepend-icon="mdi-pin"
                     active-class="active-menu-item" />
        <v-divider class="my-1" />
      </template>
      <v-list-item :title="t('menu.home')" to="/" prepend-icon="mdi-home" active-class="active-menu-item" />

      <v-list-item :title="t('menu.orgs')" to="/organizations" prepend-icon="mdi-domain"
                   active-class="active-menu-item" />
      <v-divider class="my-1" />
      <template v-if="loggedIn">
        <v-list-item :title="t('nav.account')" to="/account" prepend-icon="mdi-cog" active-class="active-menu-item" />

        <v-list-item :title="t('nav.profile')" to="/profile" prepend-icon="mdi-account"
                     active-class="active-menu-item" />

        <v-list-item :title="t('nav.logout')" to="/logout" prepend-icon="mdi-logout" @click="clear"
                     active-class="active-menu-item" />
      </template>
    </template>

    <template v-if="!loggedIn">     
      <v-list-item :title="t('login.title')" to="/login" prepend-icon="mdi-login" active-class="active-menu-item" />

      <v-list-item :title="t('register.title')" to="/register" prepend-icon="mdi-account-plus"
                   active-class="active-menu-item" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const { clear, loggedIn, ready } = useUserSession();

</script>
