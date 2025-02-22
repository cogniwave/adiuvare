<template>
  <ad-auth-form-card ref="form" :title="t('register.title')" :show-form="!userCreated" @submit="submit">
    <template #form>
      <v-text-field
        v-model:model-value="name"
        type="text"
        prepend-icon="fa-solid fa-user"
        :label="t('form.name')"
        :error-messages="errors.name"
        :rules="[required(t)]"
      />

      <v-text-field
        v-model:model-value="email"
        type="email"
        class="mt-6"
        prepend-icon="fa-solid fa-at"
        :label="t('form.email')"
        :error-messages="errors.email"
        :rules="[required(t), isValidEmail(t)]"
      />

      <v-text-field
        v-model:model-value="email2"
        type="email"
        prepend-icon="fa-solid fa-at"
        class="mt-6"
        :label="t('form.emailRepeat')"
        :rules="[required(t), isValidEmail(t), match(t, email, t('form.emailDuplicateKey'))]"
      />

      <v-text-field
        v-model:model-value="password"
        prepend-icon="fa-solid fa-lock"
        class="mt-6"
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
        class="mt-6"
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

      <v-input hide-details prepend-icon="fa-solid fa-users">
        <v-radio-group v-model:model-value="type" inline hide-details class="mt-6" :label="t('form.userType.title')">
          <v-radio :label="t('form.userType.org')" value="org" />
          <v-radio :label="t('form.userType.volunteer')" value="volunteer" />
        </v-radio-group>
      </v-input>

      <v-checkbox v-model:model-value="privacyPolicy" class="mt-10 mb-2" hide-details="auto" :rules="[required(t)]">
        <template #label>
          <i18n-t scope="global" keypath="form.privacyPolicy" tag="label" for="form.privacyPolicyLink">
            <a
              href="https://kehibvrmkdygejnd.public.blob.vercel-storage.com/pp-UDhf9fo8lpJMQUwNJeGnKkCpRyPGOe.pdf"
              target="_blank"
            >
              {{ t("form.privacyPolicyLink") }}*
            </a>
          </i18n-t>
        </template>
      </v-checkbox>

      <v-checkbox v-model:model-value="eula" class="mb-2" hide-details="auto" :rules="[required(t)]">
        <template #label>
          <i18n-t scope="global" keypath="form.eula" tag="label">
            <a
              href="https://kehibvrmkdygejnd.public.blob.vercel-storage.com/eula-0aoyOz5t1i4QBJVcoh2BtkjWI7j73r.pdf"
              target="_blank"
            >
              {{ t("form.eulaLink") }}*
            </a>
          </i18n-t>
        </template>
      </v-checkbox>

      <v-checkbox v-model:model-value="newsletter" hide-details="auto" :label="t('form.subscribeNewsletter')" />
    </template>

    <template #actions>
      <template v-if="!xs">
        <nuxt-link to="login" class="text-blue-grey mr-auto">
          {{ t("login.title") }}
        </nuxt-link>

        <v-btn type="submit" color="primary" :loading="submitting">
          {{ t("register.register") }}
        </v-btn>
      </template>

      <div v-else class="d-flex flex-column align-center w-100">
        <v-btn type="submit" color="primary" :loading="submitting">
          {{ t("register.register") }}
        </v-btn>

        <nuxt-link to="login" class="text-blue-grey mt-4">
          {{ t("login.title") }}
        </nuxt-link>
      </div>
    </template>

    <template #content>
      <p class="mb-3">{{ t("register.successMessage") }}</p>
    </template>
  </ad-auth-form-card>
</template>

<script setup lang="ts">
  import AdAuthFormCard from "app/components/common/AdAuthFormCard.vue";
  import { required, isValidEmail, isValidPassword, match } from "app/utils/validators";
  import { useNotify } from "app/store/notify";
  import { useFormErrors } from "app/composables/formErrors";

  import type { User, UserType } from "shared/types/user";

  definePageMeta({
    layout: "auth",
    middleware: "unauthed",
    path: "/register",
    title: "pages.register",
  });

  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { t } = useI18n();
  const { switchVisibility, password, password2, passwordFieldType, visibilityIcon } = usePassword();
  const { xs } = useDisplay();
  const { notifySuccess } = useNotify();

  const email = ref<string>("");
  const email2 = ref<string>("");
  const name = ref<string>("");
  const privacyPolicy = ref<string>("");
  const eula = ref<string>("");
  const type = ref<UserType>("org");
  const newsletter = ref<boolean>(false);
  const userCreated = ref<boolean>(false);

  const form = ref<InstanceType<typeof AdAuthFormCard>>();
  const submitting = ref<boolean>(false);

  const submit = async () => {
    clearErrors();

    if (!form.value) {
      return;
    }

    if (!(await form.value.validate())?.valid) {
      return;
    }

    submitting.value = true;

    await $fetch<User>("/api/v1/auth/register", {
      method: "post",
      body: {
        email: email.value,
        password: password.value,
        name: name.value,
        type: type.value,
        newsletter: newsletter.value,
      },
    })
      .then(() => {
        notifySuccess(t("form.user.createdSuccesffuly"));
        userCreated.value = true;
      })
      .catch(handleErrors)
      .finally(() => (submitting.value = false));
  };
</script>

<style scoped lang="scss">
  :deep(.v-checkbox) {
    .v-selection-control {
      min-height: 0 !important;
    }

    .v-selection-control__wrapper {
      height: 0 !important;
    }
  }
</style>
