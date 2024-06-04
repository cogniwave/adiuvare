<template>
  <v-main>
    <v-row no-gutters class="py-10">
      <v-col cols="2">
        <v-list bg-color="transparent">
          <v-list-item :title="t('menu.home')" to="/" prepend-icon="fa-solid fa-house" />

          <v-list-item
            :title="t('menu.orgs')"
            to="/organizations"
            prepend-icon="fa-solid fa-building-ngo"
          />

          <v-list-item
            v-if="showUserPosts"
            prepend-icon="fa-solid fa-file-lines"
            :title="t('menu.posts')"
            :to="{ path: '/', query: { createdBy: $route.params.slug } }"
          />
        </v-list>
      </v-col>

      <v-col offset="1" cols="6">
        <slot />
      </v-col>
    </v-row>
  </v-main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import { useAuth } from "@/store/auth";

const { data } = useAuth();
const { t } = useI18n();
const $route = useRoute();

const showUserPosts = computed(() => {
  // if no meta exists its because its error page
  if (["/", "/organizations"].includes($route.path) || !Object.keys($route.meta).length) {
    return false;
  }

  if ($route.path === "/profile") {
    return data.value?.type === "org";
  }

  return true;
});
</script>
