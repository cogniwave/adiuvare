<template>
  <v-img
    :alt="alt"
    :lazy-src="lazySrc || '/assets/images/profile-placeholder.png'"
    :src="src || '/assets/images/profile-placeholder.png'"
  >
    <template v-slot:error>
      <v-img
        src="/assets/images/profile-placeholder.png"
        :alt="alt"
        cover
        referrerpolicy="same-origin"
      />
    </template>
  </v-img>
</template>

<script lang="ts" setup>
defineProps({
  alt: { type: String, required: true },
  src: { type: String },
  lazySrc: { type: String },
});
</script>
