<template>
  <v-list bg-color="transparent">
    <template v-if="loggedIn">
      <v-list-item :title="t('posts.submit')" to="/posts/new" prepend-icon="fa-solid fa-house" />

      <v-divider class="my-3" />
    </template>

    <v-list-item :title="t('menu.home')" to="/" prepend-icon="fa-solid fa-house" />

    <v-list-item
      :title="t('menu.orgs')"
      to="/organizations"
      prepend-icon="fa-solid fa-building-ngo"
    />

    <!-- <v-list-item
            v-if="showUserPosts"
            prepend-icon="fa-solid fa-file-lines"
            :title="t('menu.posts')"
            :to="{ path: '/', query: { createdBy: $route.params.slug } }"
          /> -->
  </v-list>
</template>

<script setup lang="ts">
import { useAuth } from "@/store/auth";

const { t } = useI18n();
const { loggedIn } = useAuth();
</script>

<style scoped>
.v-list {
  position: fixed;
  max-width: 285px;
  width: inherit;
}
</style>
