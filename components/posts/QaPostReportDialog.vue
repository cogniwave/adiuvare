<template>
  <v-dialog
    :model-value="$store.dialogVisible"
    width="65vw"
    persistent
    @update:model-value="$store.toggleDialog(false)"
  >
    <v-card>
      <v-card-title class="bg-primary" :title="$t('posts.report.title')" />

      <v-card-text>
        <p v-html="$t('posts.report.description')" />

        <v-form ref="form" class="px-4 pt-4" validate-on="submit lazy" @submit.prevent="submit">
          <!-- email -->
          <form-qa-input
            v-model:model-value="email"
            class="mb-5"
            type="email"
            icon="fa-solid fa-at"
            :readonly="status === 'authenticated'"
            :label="$t('form.report.email')"
            :placeholder="$t('form.report.emailPlaceholder')"
            :rules="[required, isEmail]"
            :error="errors.email"
          />

          <!-- reason -->
          <form-qa-textarea
            v-model:model-value="reason"
            icon="fa-solid fa-comment"
            :placeholder="$t('form.report.reasonPlaceholder')"
            :label="$t('form.report.reason')"
            :rules="[required]"
            :error="errors.reason"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-5 d-flex align-center justify-end">
        <v-btn color="primary" :disable="submitting" @click="$store.toggleDialog(false)">
          {{ $t("posts.report.cancel") }}
        </v-btn>

        <v-btn type="submit" :loading="submitting" @click="submit">
          {{ $t("posts.report.submit") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";

import { submitReport } from "@/services/report.service";
import { required } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { useReportStore } from "@/stores/report.store";
import { useNotifyStore } from "@/stores/notify.store";

const $store = useReportStore();
const $notifyStore = useNotifyStore();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { data, status } = useAuth();
const { t } = useI18n();

const reason = ref("");
const email = ref(data.value.email || "");

const submitting = ref(false);
const form = ref<VForm>();

watch(
  () => $store.dialogVisible,
  (val) => {
    if (!val) {
      return;
    }

    clearErrors();

    reason.value = "";
    email.value = data.value.email || "";
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

  submitReport({ post: $store.post, user: email.value, reason: reason.value })
    .then(() => {
      $notifyStore.notifySuccess(t("posts.report.success"));
      $store.toggleDialog(false);
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
