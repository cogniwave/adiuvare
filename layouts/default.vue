<template>
  <template v-if="!loading">
    <qa-navbar />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <qa-notifications /> -->

    <qa-snackbar />

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

  <div v-else class="loader-container">
    <div class="loader" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const { loading } = useAuth();
const { t } = useI18n();
const $route = useRoute();
const { data } = useAuth();

const showUserPosts = computed(() => {
  if (!["/", "/organizations"].includes($route.path)) {
    if ($route.path === "/profile") {
      return data.value?.type === "org";
    }

    return true;
  }

  return false;
});
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .loader {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    border: 4px solid #0000;
    border-radius: 50%;
    border-right-color: rgba(var(--v-theme-primary));
    animation: l15 1s infinite linear;

    &::before,
    &::after {
      content: "";
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 50%;
      animation: l15 2s infinite;
    }

    &::after {
      margin: 8px;
      animation-duration: 3s;
    }
  }
}

@keyframes l15 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
