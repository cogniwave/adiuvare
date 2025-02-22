<template>
  <template v-if="!ready">
    <v-menu v-if="loggedIn">
      <template #activator="{ props }">
        <span v-bind="props" class="cursor-pointer ml-5">
          {{ user?.name }}
          <v-icon class="ml-2 mb-1">fa-solid fa-chevron-down</v-icon>
        </span>
      </template>

      <v-list>
        <v-list-item :title="t('nav.account')" append-icon="fa-solid fa-gear" @click="$router.push('/account')" />

        <v-list-item :title="t('nav.profile')" append-icon="fa-solid fa-user" @click="$router.push('/profile')" />

        <v-list-item :title="t('nav.logout')" append-icon="fa-solid fa-arrow-right-from-bracket" @click="clear" />
      </v-list>
    </v-menu>

    <template v-else>
      <v-btn variant="plain" class="px-0" to="/login"> {{ t("login.title") }} </v-btn>
      <span class="mx-2 divider">|</span>
      <v-btn variant="plain" class="px-0" to="/register"> {{ t("register.title") }} </v-btn>
    </template>
  </template>
</template>

<script setup lang="ts">
  const $router = useRouter();
  const { clear, loggedIn, user, ready } = useUserSession();
  const { t } = useI18n();
</script>

<style scoped>
  span {
    color: rgba(var(--v-theme-primary));
  }
</style>
