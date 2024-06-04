<template>
  <v-app>
    <NuxtLayout>
      <ad-navbar />

      <div class="error-page">
        <template v-if="error.statusCode === 404">
          <h1>{{ $t("errorPage.404.title") }}</h1>
          <p>{{ $t("errorPage.404.body") }}</p>
        </template>

        <template v-else>
          <h1>{{ $t("errorPage.unexpected.title") }}</h1>
          <p>{{ $t("errorPage.unexpected.body") }}</p>

          <div v-if="isDev" class="mb-5">
            {{ error }}
          </div>
        </template>
      </div>

      <v-btn color="primary" flat class="d-flex mx-auto" @click="home">
        {{ $t("errorPage.backButton") }}
      </v-btn>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { type NuxtError, useRouter } from "#app";

defineProps({
  error: { type: Object as PropType<NuxtError>, required: true },
});

const $router = useRouter();

const isDev = ref(import.meta.dev);

const home = () => clearError().then(() => $router.push("/"));
</script>

<style scoped lang="scss">
.error-page {
  text-align: center;

  * {
    color: rgba(var(--v-theme-primary));
  }

  h1 {
    margin-bottom: 10%;
    font-weight: 3rem;
  }

  p {
    font-size: 1.5rem;
    line-height: 2rem;
    margin-bottom: 10%;
  }
}
</style>
