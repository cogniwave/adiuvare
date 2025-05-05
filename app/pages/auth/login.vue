<template>
  <ad-auth-form-card ref="form" :title="t('login.title')" @submit="submit">
    <template #form>
      <v-text-field
        v-model:model-value="email"
        type="email"
        prepend-icon="mdi-at"
        :label="t('form.email')"
        :rules="[required(t), isValidEmail(t)]"
        :error-messages="errors.email"
      />

      <v-text-field
        v-model:model-value="password"
        prepend-icon="mdi-lock"
        class="mt-8"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        :label="t('form.password')"
        :type="passwordFieldType"
        :rules="[required(t), isValidPassword(t)]"
        :error-messages="errors.password"
      >
        <template #append-inner>
          <v-icon class="cursor-pointer" @click="switchVisibility">{{ visibilityIcon === 'eye' ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
        </template>
      </v-text-field>
    </template>

    <template #actions>
      <!-- desktop -->
      <template v-if="mdAndUp">
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
      </template>

      <div v-else class="d-flex flex-column align-center w-100">
        <v-btn type="submit" color="primary" class="mb-5" :loading="submitting">
          {{ t("login.title") }}
        </v-btn>

        <nuxt-link to="register" class="text-blue-grey mb-3">
          {{ t("register.link") }}
        </nuxt-link>

        <nuxt-link to="reset-password" class="text-blue-grey">
          {{ t("reset.link") }}
        </nuxt-link>
      </div>
    </template>
  </ad-auth-form-card>
</template>

<script setup lang="ts">
  import AdAuthFormCard from "app/components/common/AdAuthFormCard.vue";

  import { useNotify } from "app/store/notify";
  import { required, isValidEmail, isValidPassword } from "app/utils/validators";
  import { useFormErrors } from "app/composables/formErrors";

  definePageMeta({  
    middleware: "unauthed-server",
    title: "pages.login",
    path: "/login",
  });

  const { t } = useI18n();
  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { notifyInfo, notifyWarning } = useNotify();
  const $route = useRoute();
  const $router = useRouter();
  const { fetch } = useUserSession();
  const { switchVisibility, password, passwordFieldType, visibilityIcon } = usePassword();
  const { mdAndUp } = useDisplay();

  const email = ref<string>("");
  const form = ref<InstanceType<typeof AdAuthFormCard>>();
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

    try {
      await $fetch("/api/v1/auth/login", {
        method: "POST",
        body: { email: email.value, password: password.value },
      });
      // fetches user info
      fetch();
      navigateTo({ path: "/" });
    } catch (exc: unknown) {
      handleErrors(exc);
      submitting.value = false;
    }
  };
</script>

<style scoped>
  a {
    color: rgb(var(--v-theme-secondary)) !important;
  }

</style>