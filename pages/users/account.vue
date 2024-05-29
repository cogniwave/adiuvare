<template>
  <template v-if="loading">
    <v-skeleton-loader type="article" class="rounded-xl" />
  </template>

  <template v-else>
    <h2 class="text-h5 mb-5">{{ t("form.user.accountTitle") }}</h2>

    <v-form ref="form" validate-on="submit lazy" @keydown.enter="submit" @submit.prevent="submit">
      <div class="bg-white rounded px-10 py-5">
        <v-text-field
          v-model:model-value="email"
          type="email"
          prepend-icon="fa-solid fa-at"
          :label="t('form.email')"
          :error-messages="errors.email"
          :rules="[required(t), isValidEmail(t)]"
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
          :rules="[isValidPassword(t, true)]"
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
          :rules="[isValidPassword(t, true), match(t, password, t('form.passwordDuplicateKey'))]"
        >
          <template v-slot:append-inner>
            <v-icon class="cursor-pointer" @click="switchVisibility">
              fa-solid fa-{{ visibilityIcon }}
            </v-icon>
          </template>
        </v-text-field>
      </div>
    </v-form>

    <div class="py-5 d-flex align-center justify-end">
      <!-- todo: implement this functionality -->
      <!-- <v-btn :disable="submitting" color="error" class="mr-2" @click="$router.go(-1)">
        {{ t("form.user.delete") }}
      </v-btn> -->

      <v-spacer />

      <v-btn :disable="submitting" class="mr-2" @click="$router.go(-1)">
        {{ t("form.cancel") }}
      </v-btn>

      <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
        {{ t("form.user.accountSubmit") }}
      </v-btn>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

import { useUsers } from "@/store/users";
import { useAuth } from "@/store/auth";
import { useNotify } from "@/store/notify";
import type { TokenUser, Tokens } from "@/types/user";

definePageMeta({ path: "/account", middleware: "protected" });

const { data: auth, updateUserAndTokens } = useAuth();
const { t } = useI18n();
const $router = useRouter();
const { users } = useUsers();
const { notifySuccess } = useNotify();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { switchVisibility, password, password2, passwordFieldType, visibilityIcon } = usePassword();

const loading = ref(true);
const email = ref<string>("");
const form = ref<VForm>();
const submitting = ref<boolean>(false);

onMounted(() => (loading.value = false));

const submit = async () => {
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  const result = await form.value.validate();
  if (!result.valid || !!errors.value.file) {
    return;
  }

  clearErrors();
  submitting.value = true;

  // nothing was changed, do nothing
  const emailChanged = email.value !== (auth.value as TokenUser).email;
  if (!emailChanged && !password.value) {
    notifySuccess(t("form.user.updated"));
    submitting.value = false;
    return;
  }

  try {
    const result = await $fetch<Tokens | { success: boolean }>(
      `/api/v1/users/${(auth.value as TokenUser).id}`,
      {
        query: { action: "account" },
        body: {
          ...(emailChanged && { email: email.value }),
          ...(password.value && { password: password.value }),
        },
        method: "patch",
      },
    );

    if (emailChanged) {
      users.value = users.value.map((u) => {
        return u.email === (auth.value as TokenUser).email ? { ...u, email: email.value } : u;
      });

      updateUserAndTokens({ email: email.value }, result as Tokens);
    }

    notifySuccess(t("form.user.updated"));
  } catch (errs: any) {
    handleErrors(errs);
  } finally {
    submitting.value = false;
  }
};

watch(auth, (auth) => auth && (email.value = auth.email), { immediate: true });
</script>

<style scoped lang="scss">
.pic-wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 100px;
  width: 128px;
  display: block;
  margin: auto;

  .camera-wrapper {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
}
</style>
