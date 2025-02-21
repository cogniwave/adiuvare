<template>
  <ad-auth-form-card ref="form" :show-form="false" :title="t('register.confirmation.title')">
    <template #content>
      <template v-if="!loading">
        <p v-if="invalidLink">{{ t("register.confirmation.invalidLink") }}</p>

        <p v-else-if="expiredLink">{{ t("register.confirmation.expiredLink") }}</p>

        <i18n-t
          v-else-if="success"
          scope="global"
          keypath="register.confirmation.success"
          tag="p"
          for="register.confirmation.success"
        >
          <nuxt-link to="/login" class="text-blue-grey">
            {{ t("login.title") }}
          </nuxt-link>
        </i18n-t>

        <p v-else>{{ t("register.confirmation.error") }}</p>
      </template>

      <p v-else>{{ t("register.confirmation.loading") }}</p>
    </template>
  </ad-auth-form-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  middleware: "unauthed",
  layout: "auth",
  title: "pages.accountConfirm",
  path: "/confirmation",
});

const $route = useRoute();
const { t } = useI18n();

const loading = ref<boolean>(true);
const success = ref(true);
const invalidLink = ref(false);
const expiredLink = ref(false);

onBeforeMount(() => {
  const { token, email } = $route.query;

  if (!token || !email) {
    loading.value = false;
    return (invalidLink.value = false);
  }

  // todo: add validation for link expiration

  $fetch("/api/v1/auth/confirm", { method: "patch", body: { token, email } })
    .catch(() => (success.value = false))
    .finally(() => (loading.value = false));
});
</script>

<style lang="scss" scoped>
a {
  transition: 0.2s;
  opacity: 0.8;

  &:hover {
    transition: 0.2s;
    opacity: 1;
  }
}
</style>
