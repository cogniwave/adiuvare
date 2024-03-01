<template>
  <v-row align-content="center">
    <v-col cols="4" offset="4" md="6" offset-md="3" sm="8" offset-sm="2">
      <v-card class="shadow-24 q-pb-md">
        <v-card-title class="bg-primary">
          <h1 class="text-h5 text-white">Registar</h1>
        </v-card-title>

        <v-card-item>
          <v-form
            v-if="!userCreated"
            ref="form"
            class="px-4 pt-4"
            validate-on="submit lazy"
            @submit.prevent="submit"
          >
            <form-qa-input
              v-model:model-value="name"
              type="text"
              label="Nome"
              class="mt-3"
              icon="face"
              :error="errors.name"
              :rules="[required]"
            />

            <form-qa-input
              v-model:model-value="email"
              type="email"
              label="Email"
              class="mt-3"
              icon="email"
              :error="errors.email"
              :rules="[required, isEmail]"
            />

            <form-qa-input
              v-model:model-value="email2"
              type="email"
              label="Repita email"
              icon="email"
              class="mt-3"
              :rules="[required, isEmail, match(email, 'Emails')]"
            />

            <form-qa-input
              v-model:model-value="password"
              label="Palavra passe"
              icon="lock"
              class="mt-3"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :error="errors.password"
              :type="passwordFieldType"
              :rules="[required, isValidPassword]"
            >
              <template v-slot:append>
                <v-icon class="cursor-pointer" @click="switchVisibility">
                  {{ visibilityIcon }}
                </v-icon>
              </template>
            </form-qa-input>

            <form-qa-input
              v-model:model-value="password2"
              label="Repita palavra passe"
              autocorrect="off"
              class="mt-3"
              icon="lock"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :type="passwordFieldType"
              :rules="[
                required,
                isValidPassword,
                match(password, 'Palavras passe'),
              ]"
            >
              <template v-slot:append>
                <v-icon class="cursor-pointer" @click="switchVisibility">
                  {{ visibilityIcon }}
                </v-icon>
              </template>
            </form-qa-input>

            <v-radio-group
              v-model:model-value="type"
              inline
              class="mt-3"
              label="Tipo de utilizador"
            >
              <v-radio label="Voluntário" value="volunteer" />
              <v-radio label="Organização" value="org" />
            </v-radio-group>

            <v-card-actions class="px-5 d-flex flex-column">
              <v-btn
                type="submit"
                variant="tonal"
                color="primary"
                class="w-75 mb-5"
                :loading="submitting"
              >
                Criar conta
              </v-btn>

              <router-link to="login" class="text-blue-grey pb-1">
                Iniciar sessão
              </router-link>
            </v-card-actions>
          </v-form>

          <div v-else>
            <h2 class="my-4 text-center">Criado com sucesso</h2>

            <p class="mb-3">Foi enviado um email para confirmar o registo</p>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { UserType } from "@/types/user";
import type { VForm } from "vuetify/lib/components/index.mjs";

import { register } from "@/services/user.service";
import { required, isEmail, isValidPassword, match } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

useHead({ title: "Criar conta" });

const email = ref<string>("");
const email2 = ref<string>("");
const password = ref<string>("");
const password2 = ref<string>("");
const name = ref<string>("");
const type = ref<UserType>("org");
const userCreated = ref<boolean>(false);

const { errors, handleErrors, clearErrors } = useFormErrors();

const form = ref<VForm>();
const passwordFieldType = ref<"text" | "password">("password");
const visibility = ref<boolean>(false);
const visibilityIcon = ref<"visibility" | "visibility_off">("visibility");
const submitting = ref<boolean>(false);

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
  clearErrors();

  if (!(await form.value?.validate())) {
    return;
  }

  submitting.value = true;

  register({
    email: email.value,
    password: password.value,
    name: name.value,
    type: type.value,
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
