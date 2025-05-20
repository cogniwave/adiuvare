<template>
  <v-list class="py-0" bg-color="background">
    <ad-menu-content />
  </v-list>
</template>


<script setup lang="ts">
  import AdMenuContent from "app/components/layout/AdMenuContent.vue";
</script>

<style lang="scss" scoped>
  .v-list-item {
    transition: 200ms;
    margin-top: 4px;
    color: rgb(var(--v-theme-text));
    margin-bottom: 4px;

    &:hover {
      background: rgb(var(--v-theme-accent));
      transition: 200ms;
    }

    &.v-list-item--active {
      background: rgb(var(--v-theme-accent));
      color: rgb(var(--v-theme-text));
    }

    .v-list-item__overlay {
      background: rgb(var(--v-theme-accent));
    }
  }
</style>
