<template>
  <v-row align-content="center">
    <v-col cols="4" offset="4" md="6" offset-md="3" sm="8" offset-sm="2">
      <v-card class="shadow-24 q-pb-md">
        <v-card-title class="bg-primary">
          <h2 class="text-h5 text-white q-my-xs"></h2>
        </v-card-title>

        <template v-if="!emailSent">
          <v-card-item>
            <v-form
              greedy
              no-error-focus
              no-reset-focus
              ref="form"
              class="q-px-sm q-pt-sm"
              @keydown.enter="submit"
            >
              <form-qa-input
                v-model:model-value="email"
                class="mt-3"
                type="email"
                icon="email"
                :label="$t('form.email')"
                :error="errors.email"
                :rules="[required, isEmail]"
              />
            </v-form>
          </v-card-item>

          <v-card-actions class="px-5 d-flex flex-column">
            <v-btn
              type="submit"
              variant="tonal"
              color="primary"
              class="w-75 mb-5"
              :loading="submitting"
              @click="submit"
            >
              {{ $t("register.submit") }}
            </v-btn>

            <router-link to="register" class="text-blue-grey pb-1">
              {{ $t("register.link") }}
            </router-link>

            <router-link to="login" class="text-blue-grey">
              {{ $t("login.title") }}
            </router-link>
          </v-card-actions>
        </template>

        <v-card-item v-else>
          <h6 class="q-my-md">
            {{ $t("reset.success") }}
          </h6>

          <span class="q-text-center">
            {{ $t("reset.successExtended") }}
          </span>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { VForm } from "vuetify/lib/components/index.mjs";

import { required, isEmail } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { resetPassword } from "@/services/user.service";

definePageMeta({
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

  if (!(await form.value.validate())) {
    return;
  }

  clearErrors();
  submitting.value = true;

  resetPassword(email.value)
    .then(() => (emailSent.value = true))
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
</script>
