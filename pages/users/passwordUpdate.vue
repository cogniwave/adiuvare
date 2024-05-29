<template>
  <v-card class="shadow-24">
    <v-card-title class="bg-primary">
      <h1 class="text-h5 text-white">{{ t("reset.updateTitle") }}</h1>
    </v-card-title>

    <v-card-item class="bg-white">
      <template v-if="!loading">
        <i18n-t
          v-if="invalidLink"
          scope="global"
          keypath="reset.updateInvalidBody"
          tag="p"
          for="reset.updateInvalidBody"
        >
          <nuxt-link to="/reset-password" class="text-blue-grey">
            {{ t("reset.updateResetLink") }}
          </nuxt-link>
        </i18n-t>

        <i18n-t
          v-else-if="expiredLink"
          scope="global"
          keypath="reset.updateExpiredBody"
          tag="p"
          for="reset.updateExpiredBody"
        >
          <nuxt-link to="/reset-password" class="text-blue-grey">
            {{ t("reset.updateResetLink") }}
          </nuxt-link>
        </i18n-t>

        <v-form
          v-else
          ref="form"
          class="px-4 pt-4"
          validate-on="submit lazy"
          @submit.prevent="submit"
        >
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

          <v-divider />

          <v-card-actions class="d-flex align-center justify-end">
            <v-btn type="submit" color="primary" :loading="submitting">
              {{ t("reset.update") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </template>

      <v-skeleton-loader v-else type="article" />
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "#vue-router";
import type { VForm } from "vuetify/lib/components/index.mjs";

import dayjs from "@/services/dayjs.service";
import { required, isValidPassword, match } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";

import type { User } from "@/types/user";

let email: string = "";
let token: string = "";

definePageMeta({
  layout: "auth",
  path: "/profile/password",
  middleware: "unauthed",
});

const { t } = useI18n();

useHead({ title: t("pages.updatePassword") });

const $route = useRoute();
const $router = useRouter();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { switchVisibility, password, password2, passwordFieldType, visibilityIcon } = usePassword();

const loading = ref(true);
const invalidLink = ref(false);
const expiredLink = ref(false);

const form = ref<VForm>();
const submitting = ref<boolean>(false);

onBeforeMount(() => {
  loading.value = true;
  const { token: tk, email: _email } = $route.query;

  if (!tk || !_email) {
    invalidLink.value = true;
    return;
  }

  const expireTimestamp = (tk as string).split("-")[1];

  if (dayjs(expireTimestamp).isAfter(dayjs().add(12, "hours")) || tk.length !== 46) {
    expiredLink.value = true;
    return;
  }

  token = tk as string;
  email = _email as string;
});

onMounted(() => (loading.value = false));

const submit = async () => {
  clearErrors();

  if (!(await form.value?.validate())?.valid) {
    return;
  }

  submitting.value = true;

  await $fetch<User>("/api/v1/auth/password", {
    method: "patch",
    body: {
      email,
      token,
      password: password.value,
    },
  })
    .then(() => {
      $router.replace({ path: "/login", query: { passwordReset: "true" } });
    })
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
</script>

<style lang="scss" scoped>
p {
  font-size: 18px;
  line-height: 20px;
  margin-top: 12px;
  margin-bottom: 12px;
  text-align: center;
}

a {
  transition: 0.2s;
  opacity: 0.8;

  &:hover {
    transition: 0.2s;
    opacity: 1;
  }
}
</style>
