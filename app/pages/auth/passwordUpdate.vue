<template>
  <ad-auth-form-card
    ref="form"
    :loading="loading"
    :title="t('reset.updateTitle')"
    :show-form="!invalidLink && !expiredLink"
    @submit="submit"
  >
    <template #form>
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
        <template #append-inner>
          <v-icon class="cursor-pointer" @click="switchVisibility"> fa-solid fa-{{ visibilityIcon }} </v-icon>
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
        :rules="[required(t), isValidPassword(t), match(t, password, t('form.passwordDuplicateKey'))]"
      >
        <template #append-inner>
          <v-icon class="cursor-pointer" @click="switchVisibility"> fa-solid fa-{{ visibilityIcon }} </v-icon>
        </template>
      </v-text-field>
    </template>

    <template #actions>
      <v-btn type="submit" color="primary" :loading="submitting">
        {{ t("reset.update") }}
      </v-btn>
    </template>

    <template #content>
      <i18n-t v-if="invalidLink" scope="global" keypath="reset.updateInvalidBody" tag="p" for="reset.updateInvalidBody">
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
    </template>
  </ad-auth-form-card>
</template>

<script setup lang="ts">
  import { required, isValidPassword, match } from "app/utils/validators";
  import { useFormErrors } from "app/composables/formErrors";
  import AdAuthFormCard from "app/components/common/AdAuthFormCard.vue";

  import dayjs from "shared/services/dayjs.service";
  import type { User } from "shared/types/user";

  let email: string = "";
  let token: string = "";

  definePageMeta({
    layout: "auth",
    path: "/profile/password",
    middleware: "unauthed",
    title: "pages.updatePassword",
  });

  const { t } = useI18n();
  const $route = useRoute();
  const $router = useRouter();
  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { switchVisibility, password, password2, passwordFieldType, visibilityIcon } = usePassword();

  const loading = ref(true);
  const invalidLink = ref(false);
  const expiredLink = ref(false);

  const form = ref<InstanceType<typeof AdAuthFormCard>>();
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
