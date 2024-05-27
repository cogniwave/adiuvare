<template>
  <v-card class="shadow-24" :loading="submitting">
    <v-card-title>{{ t("register.confirmation.title") }}</v-card-title>

    <v-card-item>
      <template v-if="submitting">
        <template v-if="success">
          <p class="mb-3">
            {{ t("register.confirmation.confirmSuccess") }}
            <nuxt-link to="login" class="text-blue-grey pb-1">
              {{ t("login.title") }}
            </nuxt-link>
          </p>
        </template>

        <template v-else>
          <p class="mb-3">
            {{ t("register.confirmation.confirmError") }}
          </p>
        </template>
      </template>

      <p>{{ t("register.confirmation.confirmLoading") }}</p>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { $csrfFetch } = useNuxtApp();
const $route = useRoute();
const { t } = useI18n();

const submitting = ref<boolean>(true);
const success = ref<boolean>(true);

useHead({ title: t("register.confirmation.seoTitle") });

definePageMeta({ middleware: "unauthed", layout: "auth", path: "/confirmation" });

onBeforeMount(() => {
  const token = $route.params.token;

  if (!token) {
    submitting.value = false;
    return (success.value = false);
  }

  $csrfFetch("/api/v1/auth/confirm", { method: "post", body: { token } })
    .catch(() => (success.value = false))
    .finally(() => (submitting.value = false));
});
</script>

<style lang="scss" scoped>
a {
  transition: 0.2s;
  opacity: 0.6;

  &:hover {
    transition: 0.2s;
    opacity: 1;
  }
}
</style>
