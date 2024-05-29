<template>
  <v-card class="pb-3 bg-white">
    <v-card-title class="bg-primary">
      <h2 class="text-h5 text-white">{{ t("login.title") }}</h2>
    </v-card-title>

    <v-form ref="form" class="px-4 pt-4" validate-on="submit lazy" @submit.prevent="submit">
      <v-card-text>
        <v-text-field
          v-model:model-value="email"
          type="email"
          prepend-icon="fa-solid fa-at"
          :label="t('form.name')"
          :rules="[required(t), isValidEmail(t)]"
          :error-messages="errors.email"
        />

        <v-text-field
          v-model:model-value="password"
          prepend-icon="fa-solid fa-lock"
          class="mt-10"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          :label="t('form.password')"
          :type="passwordFieldType"
          :rules="[required(t), isValidPassword(t)]"
          :error-messages="errors.password"
        >
          <template v-slot:append-inner>
            <v-icon class="cursor-pointer" @click="switchVisibility">
              fa-solid fa-{{ visibilityIcon }}
            </v-icon>
          </template>
        </v-text-field>
      </v-card-text>

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <nuxt-link to="register" class="text-blue-grey">
          {{ t("register.link") }}
        </nuxt-link>

        <span class="text-blue-grey mx-2">| </span>

        <nuxt-link to="reset-password" class="text-blue-grey mr-auto">
          {{ t("reset.link") }}
        </nuxt-link>

        <v-btn type="submit" color="primary" :loading="submitting">
          {{ t("login.title") }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";

import { useAuth } from "@/store/auth";
import { useNotify } from "@/store/notify";
import { required, isValidEmail, isValidPassword } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";

definePageMeta({
  layout: "auth",
  middleware: "unauthed",
  title: "pages.login",
});

const { t } = useI18n();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { notifyError, notifyInfo, notifyWarning } = useNotify();
const $route = useRoute();
const $router = useRouter();
const { login } = useAuth();
const { switchVisibility, password, passwordFieldType, visibilityIcon } = usePassword();

const email = ref<string>("");
const form = ref<VForm>();
const submitting = ref<boolean>(false);

onMounted(() => {
  if ($route.query?.requireAuth) {
    notifyWarning(t("login.actionRequiresAuth"));

    $router.replace({
      path: "/login",
      query: { ...$route.query, requireAuth: undefined },
    });
  } else if ($route.query?.passwordReset) {
    notifyInfo(t("login.passwordReset"));

    $router.replace({
      path: "/login",
      query: { ...$route.query, passwordReset: undefined },
    });
  }
});

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

  login({ email: email.value, password: password.value })
    .then(() => {
      navigateTo({ path: "/" });
    })
    .catch((errs) => {
      console.log(errs);
      if (errs.statusCode === 401) {
        notifyError(t("errors.invalidCredentials"));
      } else if (errs.statusCode === 400) {
        notifyWarning(t("errors.unverifiedUser"));
      } else {
        handleErrors(errs);
      }

      submitting.value = false;
    });
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
