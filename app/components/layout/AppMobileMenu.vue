<template>
  <v-navigation-drawer v-model:model-value="menuOpen" temporary location="left" open-delay="0" close-delay="0">
    <v-list nav>
      <app-menu-content />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
  import { useMenu } from "app/store/menu";
  import AppMenuContent from "app/components/layout/AppMenuContent.vue";

  const { menuOpen } = useMenu();
</script>
