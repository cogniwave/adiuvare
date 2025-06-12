<template>
  <v-avatar :size="size">
    <v-img v-if="src" :src="src" :alt="$t('posts.logoAlt')" :lazy-src="lazySrc">
      <template #error>
        <v-icon>fa-shop-slash</v-icon>
      </template>
    </v-img>

    <v-icon v-else>fa-shop-slash</v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
  defineProps({
    size: { type: String, default: "96" },
    src: { type: String, default: null },
    lazySrc: { type: String, default: "/assets/images/profile-placeholder.png" },
  });
</script>
