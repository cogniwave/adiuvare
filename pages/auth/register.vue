<template>
  <v-card class="shadow-24">
    <v-card-title class="bg-primary">
      <h1 class="text-h5 text-white">{{ t("register.title") }}</h1>
    </v-card-title>

    <v-card-item class="bg-white">
      <v-form
        v-if="!userCreated"
        ref="form"
        class="px-4 pt-4"
        validate-on="submit lazy"
        @submit.prevent="submit"
      >
        <v-text-field
          v-model:model-value="name"
          type="text"
          class="mt-3"
          prepend-icon="fa-solid fa-user"
          :label="t('form.name')"
          :error-messages="errors.name"
          :rules="[required(t)]"
        />

        <v-text-field
          v-model:model-value="email"
          type="email"
          class="mt-3"
          prepend-icon="fa-solid fa-at"
          :label="t('form.email')"
          :error-messages="errors.email"
          :rules="[required(t), isValidEmail(t)]"
        />

        <v-text-field
          v-model:model-value="email2"
          type="email"
          prepend-icon="fa-solid fa-at"
          class="mt-3"
          :label="t('form.emailRepeat')"
          :rules="[required(t), isValidEmail(t), match(t, email, t('form.emailDuplicateKey'))]"
        />

        <v-text-field
          v-model:model-value="password"
          prepend-icon="fa-solid fa-lock"
          class="mt-3"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          :label="t('form.password')"
          :error-messages="errors.password"
          :type="passwordFieldType"
          :rules="[required(t), isValidPassword(t)]"
        >
          <template v-slot:append-inner>
            <v-icon class="cursor-pointer" @click="switchVisibility">
              fa-solid fa-{{ visibilityIcon }}
            </v-icon>
          </template>
        </v-text-field>

        <v-text-field
          v-model:model-value="password2"
          autocorrect="off"
          class="mt-3"
          prepend-icon="fa-solid fa-lock"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          :label="t('form.passwordRepeat')"
          :type="passwordFieldType"
          :rules="[
            required(t),
            isValidPassword(t),
            match(t, password, t('form.passwordDuplicateKey')),
          ]"
        >
          <template v-slot:append-inner>
            <v-icon class="cursor-pointer" @click="switchVisibility">
              fa-solid fa-{{ visibilityIcon }}
            </v-icon>
          </template>
        </v-text-field>

        <v-radio-group
          v-model:model-value="type"
          inline
          class="mt-3"
          :label="t('form.userType.title')"
        >
          <v-radio :label="t('form.userType.volunteer')" value="volunteer" />
          <v-radio :label="t('form.userType.org')" value="org" />
        </v-radio-group>

        <v-divider />

        <v-card-actions class="px-5 d-flex align-center justify-end">
          <nuxt-link to="login" class="text-blue-grey mr-auto">
            {{ t("login.title") }}
          </nuxt-link>

          <v-btn type="submit" color="primary" :loading="submitting">
            {{ t("register.register") }}
          </v-btn>
        </v-card-actions>
      </v-form>

      <div v-else>
        <h2 class="my-4 text-center">{{ t("register.success") }}</h2>

        <p class="mb-3">{{ t("register.successMessage") }}</p>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { User, UserType } from "@/types/user";
import type { VForm } from "vuetify/lib/components/index.mjs";

import { required, isValidEmail, isValidPassword, match } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";

definePageMeta({
  layout: "auth",
  path: "/register",
  middleware: "unauthed",
});

useHead({ title: "Criar conta" });

const { errors, handleErrors, clearErrors } = useFormErrors();
const { t } = useI18n();
const { $csrfFetch } = useNuxtApp();

const email = ref<string>("");
const email2 = ref<string>("");
const password = ref<string>("");
const password2 = ref<string>("");
const name = ref<string>("");
const type = ref<UserType>("org");
const userCreated = ref<boolean>(false);

const form = ref<VForm>();
const passwordFieldType = ref<"text" | "password">("password");
const visibility = ref<boolean>(false);
const visibilityIcon = ref<"eye" | "eye-slash">("eye");
const submitting = ref<boolean>(false);

// form controls
const switchVisibility = () => {
  if (visibility.value) {
    visibility.value = false;
    passwordFieldType.value = "password";
    visibilityIcon.value = "eye";
  } else {
    visibility.value = true;
    passwordFieldType.value = "text";
    visibilityIcon.value = "eye-slash";
  }
};

const submit = async () => {
  clearErrors();

  if (!(await form.value?.validate())?.valid) {
    return;
  }

  submitting.value = true;

  await $csrfFetch<User>("/api/v1/auth/register", {
    method: "post",
    body: {
      email: email.value,
      password: password.value,
      name: name.value,
      type: type.value,
    },
  })
    .then(() => (userCreated.value = true))
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
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
