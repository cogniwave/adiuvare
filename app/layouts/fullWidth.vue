<template>
  <v-main>
    <v-row no-gutters class="py-10 h-100">
      <v-col v-if="$vuetify.display.mdAndUp" cols="2" md="3">
        <app-menu />
      </v-col>

      <!-- <v-col lg="9" offset-md="2" md="8" offset-sm="1" sm="10" offset="0" cols="12"> -->
      <v-col class="ml-5" cols="9" md="8">
        <slot />
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup lang="ts">
  import AppMenu from "app/components/layout/AppMenu.vue";
</script>
