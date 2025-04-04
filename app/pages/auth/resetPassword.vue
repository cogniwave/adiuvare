<template>
  <ad-auth-form-card ref="form" :title="t('reset.title')" :show-form="!submitted" @submit="submit">
    <template #form>
      <v-text-field
        v-model:model-value="email"
        type="email"
        prepend-icon="fa-solid fa-at"
        :label="t('form.email')"
        :error-messages="errors.email"
        :rules="[required(t), isValidEmail(t)]"
      />
    </template>

    <template #content>
      <span> {{ t("reset.successExtended") }} </span>
    </template>

    <template #actions>
      <template v-if="mdAndUp">
        <nuxt-link to="register" class="text-blue-grey">
          {{ t("register.link") }}
        </nuxt-link>

        <span class="text-blue-grey mx-2">|</span>

        <nuxt-link to="login" class="text-blue-grey mr-auto">
          {{ t("login.title") }}
        </nuxt-link>

        <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
          {{ t("reset.submit") }}
        </v-btn>
      </template>

      <div v-else class="d-flex flex-column align-center w-100">
        <v-btn type="submit" color="primary" class="mb-5" :loading="submitting" @click="submit">
          {{ t("reset.submit") }}
        </v-btn>

        <nuxt-link to="register" class="text-blue-grey mb-3">
          {{ t("register.link") }}
        </nuxt-link>

        <nuxt-link to="login" class="text-blue-grey">
          {{ t("login.title") }}
        </nuxt-link>
      </div>
    </template>
  </ad-auth-form-card>
</template>

<script setup lang="ts">
  import { required, isValidEmail } from "app/utils/validators";
  import { useFormErrors } from "app/composables/formErrors";
  import AdAuthFormCard from "app/components/common/AdAuthFormCard.vue";

  definePageMeta({
    layout: "auth",
    middleware: "unauthed-server",
    title: "pages.resetPassword",
    path: "/reset-password",
  });

  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { t } = useI18n();
  const { mdAndUp } = useDisplay();

  const email = ref<string>("");
  const form = ref<InstanceType<typeof AdAuthFormCard>>();
  const submitting = ref<boolean>(false);
  const submitted = ref<boolean>(false);

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

    $fetch("/api/v1/auth/reset", {
      method: "post",
      body: { email: email.value },
    })
      .then(() => (submitted.value = true))
      .catch(handleErrors)
      .finally(() => (submitting.value = false));
  };
</script>
