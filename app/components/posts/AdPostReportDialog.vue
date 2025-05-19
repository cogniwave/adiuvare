<template>
  <v-dialog :model-value="dialogVisible" width="65vw" persistent @update:model-value="dialogVisible = false">
    <v-card>
      <v-card-title>
        {{ t("posts.report.title") }}
      </v-card-title>

      <v-card-text>
        <p>{{ t("posts.report.description") }}</p>

        <v-form ref="form" class="px-4 pt-4" validate-on="input lazy" @submit.prevent="submit">
          <!-- email -->
          <v-text-field
            v-model:model-value="email"
            class="mb-10"
            type="email"
            prepend-icon="fa-solid fa-at"
            :readonly="loggedIn"
            :label="t('form.report.email')"
            :placeholder="t('form.report.emailPlaceholder')"
            :rules="[required(t), isValidEmail(t)]"
            :error-messages="errors.email"
          />

          <!-- reason -->
          <v-textarea
            v-model:model-value="reason"
            prepend-icon="fa-solid fa-comment"
            :placeholder="t('form.report.reasonPlaceholder')"
            :label="t('form.report.reason')"
            :rules="[required(t)]"
            :error-messages="errors.reason"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <v-btn color="primary" :disable="submitting" @click="dialogVisible = false">
          {{ t("posts.report.cancel") }}
        </v-btn>

        <v-btn type="submit" :loading="submitting" @click="submit">
          {{ t("posts.report.submit") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { VForm } from "vuetify/lib/components/index.mjs";

  import { useReport } from "app/store/report";
  import { useNotify } from "app/store/notify";

  import { required } from "app/utils/validators";
  import { useFormErrors } from "app/composables/formErrors";

  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { user, loggedIn } = useUserSession();
  const { t } = useI18n();
  const { dialogVisible, post } = useReport();
  const { notifySuccess } = useNotify();

  const reason = ref("");
  const email = ref(user.value?.email || "");

  const submitting = ref(false);
  const form = ref<VForm>();

  watch(
    () => dialogVisible.value,
    (val) => {
      if (!val) {
        return;
      }

      clearErrors();

      reason.value = "";
      email.value = user.value?.email || "";
    },
  );

  const submit = async () => {
    // won't really happen, but keeps linter happy
    if (!form.value) {
      return;
    }

    if (!(await form.value.validate())?.valid) {
      return;
    }

    clearErrors();
    submitting.value = true;

    $fetch("/api/v1/reports", {
      method: "post",
      body: { post: post.value, user: email.value, reason: reason.value },
    })
      .then(() => {
        notifySuccess(t("posts.report.success"));
        dialogVisible.value = false;
      })
      .catch(handleErrors)
      .finally(() => (submitting.value = false));
  };
</script>

<style scoped lang="scss">
  :deep(.v-card) {
    background-color: rgba(var(--v-theme-surface));

    p {
      letter-spacing: 1px;
      line-height: 20px;
      text-align: center;
    }
  }
</style>
