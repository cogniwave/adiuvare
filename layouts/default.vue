<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <template v-slot:title>
        <router-link to="/"> Quero Ajudar </router-link>
      </template>

      <template v-slot:append>
        <ClientOnly fallback-tag="span" fallback="Loading">
          <qa-profile-menu />
        </ClientOnly>
      </template>
    </v-app-bar>

    <qa-snackbar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
// import QaProfileMenu from "@/components/menu/QaProfileMenu.vue";
// import QaSnackbar from "@/components/common/QaSnackbar.vue";
</script>

<style scoped>
.v-toolbar__content a {
  text-decoration: none;
  color: #fff;
}

span {
  cursor: pointer;
}
</style>
