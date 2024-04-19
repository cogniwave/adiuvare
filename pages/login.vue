<template>
  <v-card class="shadow-24 pb-3 bg-white">
    <v-card-title class="bg-primary">
      <h2 class="text-h5 text-white">{{ $t("login.title") }}</h2>
    </v-card-title>

    <v-form ref="form" class="px-4 pt-4" validate-on="submit lazy" @submit.prevent="submit">
      <v-card-text>
        <form-qa-input
          v-model:model-value="email"
          type="email"
          icon="fa-solid fa-at"
          :label="$t('form.name')"
          :rules="[required, isEmail]"
          :error="errors.email"
        />

        <form-qa-input
          v-model:model-value="password"
          icon="fa-solid fa-lock"
          class="mt-3"
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          :label="$t('form.password')"
          :type="passwordFieldType"
          :rules="[required, isValidPassword]"
          :error="errors.password"
        >
          <template v-slot:append>
            <v-icon class="cursor-pointer" @click="switchVisibility">
              fa-solid fa-{{ visibilityIcon }}
            </v-icon>
          </template>
        </form-qa-input>
      </v-card-text>

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <nuxt-link to="register" class="text-blue-grey">
          {{ $t("register.link") }}
        </nuxt-link>

        <span class="text-blue-grey mx-2">| </span>

        <nuxt-link to="reset-password" class="text-blue-grey mr-auto">
          {{ $t("reset.link") }}
        </nuxt-link>

        <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
          {{ $t("login.title") }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { VForm } from "vuetify/lib/components/index.mjs";

import { required, isEmail, isValidPassword } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { useNotifyStore } from "@/stores/notify.store";
import { useSessionStore } from "@/stores/session.store";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const email = ref<string>("");
const password = ref<string>("");

const form = ref<VForm>();
const passwordFieldType = ref<"text" | "password">("password");
const visibility = ref<boolean>(false);
const visibilityIcon = ref<"eye" | "eye-slash">("eye");
const submitting = ref<boolean>(false);

const { errors, handleErrors, clearErrors } = useFormErrors();

const $notifyStore = useNotifyStore();
const $sessionStore = useSessionStore();
const $route = useRoute();
const $router = useRouter();
const { t } = useI18n();
const { signIn, data, token } = useAuth();

onMounted(() => {
  if ($route.query?.requireAuth) {
    $notifyStore.notifyWarning(t("login.actionRequiresAuth"));
    $router.replace({
      path: "/login",
      query: { ...$route.query, requireAuth: undefined },
    });
    return;
  }
});

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
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  if (!(await form.value.validate())) {
    return;
  }

  clearErrors();
  submitting.value = true;

  signIn({ email: email.value, password: password.value }, { redirect: false })
    .then(() => {
      $sessionStore.init(token.value as string, data.value);

      $router.replace($route.query?.return || "/");
    })
    .catch((errs) => {
      if (errs.statusCode === 401) {
        $notifyStore.notifyError("Email ou palavra-passe errados");
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
