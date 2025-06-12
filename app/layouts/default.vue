<template>
  <v-main v-if="!isLoading">
    <v-row v-if="$vuetify.display.mdAndUp" no-gutters class="py-10 h-100">
      <v-col cols="3" lg="2">
        <app-menu />
      </v-col>

      <v-col offset-lg="1" lg="6" md="8">
        <slot />
      </v-col>
    </v-row>

    <v-container v-else fluid>
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import AppMenu from "app/components/layout/AppMenu.vue";

  const { isLoading } = useLoadingIndicator();
</script>
