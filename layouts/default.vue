<template>
  <v-layout>
    <v-app-bar color="primary" density="compact">
      <template v-slot:title>
        <router-link to="/"> Quero Ajudar </router-link>
      </template>

      <template v-slot:append>
        <v-menu v-if="user" open-on-hover>
          <template v-slot:activator="{ props }">
            <span v-bind="props">
              {{ user.name }} <v-icon>expand_more</v-icon>
            </span>
          </template>

          <v-list>
            <v-list-item title="Sair" @click="logout">
              <template v-slot:prepend>
                <v-icon>person</v-icon>
              </template>
            </v-list-item>

            <v-list-item title="Sair" @click="logout">
              <template v-slot:prepend>
                <v-icon>logout</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn v-else variant="plain" to="login"> Iniciar sessão </v-btn>
      </template>
    </v-app-bar>

    <qa-snackbar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useSessionStore } from "@/stores/session.store";
import QaSnackbar from "@/components/common/QaSnackbar.vue";

const { user, logout } = useSessionStore();
</script>

<style scoped>
.v-toolbar__content a {
  text-decoration: none;
  color: #fff;
}
</style>
