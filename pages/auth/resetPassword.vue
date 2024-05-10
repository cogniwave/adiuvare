<template>
  <v-card class="w-100 bg-white mx-auto">
    <v-card-title class="bg-primary">
      <h2 class="text-h5 text-white">{{ $t("reset.title") }}</h2>
    </v-card-title>

    <template v-if="!emailSent">
      <v-card-item>
        <v-form greedy no-error-focus no-reset-focus ref="form" @keydown.enter="submit">
          <v-text-field
            v-model:model-value="email"
            class="mt-3"
            type="email"
            prepend-icon="fa-solid fa-at"
            :label="$t('form.email')"
            :error-messages="errors.email"
            :rules="[required($t), isValidEmail($t)]"
          />
        </v-form>
      </v-card-item>

      <v-divider />

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <nuxt-link to="register" class="text-blue-grey">
          {{ $t("register.link") }}
        </nuxt-link>

        <span class="text-blue-grey mx-2">|</span>

        <nuxt-link to="login" class="text-blue-grey mr-auto">
          {{ $t("login.title") }}
        </nuxt-link>

        <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
          {{ $t("reset.submit") }}
        </v-btn>
      </v-card-actions>
    </template>

    <v-card-item v-else class="py-5">
      <h3>{{ $t("reset.success") }}</h3>

      <span> {{ $t("reset.successExtended") }} </span>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { VForm } from "vuetify/lib/components/index.mjs";

import { required, isValidEmail } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";

definePageMeta({
  layout: "auth",
  path: "/reset-password",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const email = ref<string>("");

const form = ref<VForm>();
const submitting = ref<boolean>(false);
const emailSent = ref<boolean>(false);
const { errors, handleErrors, clearErrors } = useFormErrors();

const submit = async () => {
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  if (!(await form.value.validate()).valid) {
    return;
  }

  clearErrors();
  submitting.value = true;

  $fetch("/api/v1/auth/reset-password", {
    body: { email: email.value },
  })
    .then(() => (emailSent.value = true))
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
</script>

<style lang="scss" scoped>
form {
  height: 70px;
  display: flex;
}
</style>
