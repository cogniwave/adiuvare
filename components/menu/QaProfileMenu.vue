<template>
  <v-menu
    v-if="status === 'authenticated'"
    open-on-hover
    open-delay="0"
    close-delay="100"
  >
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="pointer ml-5">
        {{ data.name }} <v-icon>fa-solid fa-chevron-down</v-icon>
      </span>
    </template>

    <v-list>
      <v-list-item
        :title="$t('nav.profile')"
        append-icon="person"
        @click="$router.push('/profile')"
      />

      <v-list-item
        :title="$t('nav.logout')"
        append-icon="logout"
        @click="signOut({ callbackUrl: '/', redirect: true })"
      />
    </v-list>
  </v-menu>

  <v-btn v-else variant="plain" to="login"> {{ $t("login.title") }} </v-btn>
</template>

<script setup lang="ts">
const $router = useRouter();
const { signOut, status, data } = useAuth();
</script>
