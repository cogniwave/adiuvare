<template>
  <v-main>
    <v-row no-gutters class="py-10 h-100">
      <v-col cols="2">
        <ad-menu />
      </v-col>

      <!-- <v-col lg="9" offset-md="2" md="8" offset-sm="1" sm="10" offset="0" cols="12"> -->
      <v-col class="ml-5" cols="9">
        <slot />
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup lang="ts">
  import AdMenu from "app/components/layout/AdMenu.vue";
</script>
