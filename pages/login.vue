<template>
  <v-row align-content="center">
    <v-col cols="4" offset="4" md="6" offset-md="3" sm="8" offset-sm="2">
      <v-card class="shadow-24 pb-3">
        <v-card-title class="bg-primary">
          <h2 class="text-h5 text-white">Iniciar sessão</h2>
        </v-card-title>

        <v-card-text>
          <v-form
            ref="form"
            class="px-4 pt-4"
            validate-on="submit lazy"
            @submit.prevent="submit"
          >
            <form-qa-input
              v-model:model-value="email"
              type="email"
              label="Email"
              icon="email"
              :rules="[required, isEmail]"
              :error="errors.email"
            />

            <form-qa-input
              v-model:model-value="password"
              label="Palavra-passe"
              icon="lock"
              class="mt-3"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :type="passwordFieldType"
              :rules="[required, isValidPassword]"
              :error="errors.email"
            >
              <template v-slot:append>
                <v-icon class="cursor-pointer" @click="switchVisibility">
                  {{ visibilityIcon }}
                </v-icon>
              </template>
            </form-qa-input>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-5 d-flex flex-column">
          <v-btn
            type="submit"
            variant="tonal"
            color="primary"
            class="w-75 mb-5"
            :loading="submitting"
            @click="submit"
          >
            Iniciar sessão
          </v-btn>

          <router-link to="register" class="text-blue-grey pb-1">
            Criar conta
          </router-link>

          <router-link to="reset-password" class="text-blue-grey">
            Esqueci-me da palavra passe
          </router-link>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import type { VForm } from "vuetify/lib/components/index.mjs";

import { login } from "@/services/user.service";
import { required, isEmail, isValidPassword } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { useSessionStore } from "@/stores/session";

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
const visibilityIcon = ref<"visibility" | "visibility_off">("visibility");
const submitting = ref<boolean>(false);

const { errors, handleErrors, clearErrors } = useFormErrors();

const router = useRouter();
const userStore = useSessionStore();

// form controls
const switchVisibility = () => {
  if (visibility.value) {
    visibility.value = false;
    passwordFieldType.value = "password";
    visibilityIcon.value = "visibility";
  } else {
    visibility.value = true;
    passwordFieldType.value = "text";
    visibilityIcon.value = "visibility_off";
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

  login(email.value, password.value)
    .then((user) => {
      userStore.setUser(user);
      router.replace("/");
    })
    .catch((errs) => {
      handleErrors(errs);
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
