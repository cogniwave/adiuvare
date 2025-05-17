<template>
  <v-main v-if="!isLoading">
    <v-row v-if="$vuetify.display.mdAndUp" no-gutters>
      <v-col cols="2">
        <ad-menu />
      </v-col>

      <v-col offset-lg="1" lg="6" offset-md="2" md="8">
        <slot />
      </v-col>
    </v-row>

    <v-container v-else fluid>
      <slot />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import AdMenu from "app/components/layout/AdMenu.vue";

  const { isLoading } = useLoadingIndicator();
</script>
