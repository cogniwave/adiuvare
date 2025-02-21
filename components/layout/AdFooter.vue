<template>
  <v-footer color="white" class="pt-5 pb-2 flex-column">
    <div class="w-100">
      <v-row>
        <v-col md="4" offset-md="2" cols="12" offset="0">
          {{ $t("footer.newsletter.text") }}

          <v-form
            v-if="!subscribed"
            ref="form"
            validate-on="submit lazy"
            class="mt-2"
            @submit.prevent="submit"
          >
            <v-text-field
              v-model:model-value="email"
              type="text"
              class="w-100"
              placeholder="email@gmail.com"
              variant="outlined"
              :label="$t('footer.newsletter.label')"
              :error-messages="errors.email"
            >
              <template #append-inner>
                <v-btn
                  type="submit"
                  color="primary"
                  flat
                  :rounded="false"
                  :loading="submitting"
                  @click="submit"
                >
                  {{ $t("footer.newsletter.subscribe") }}
                </v-btn>
              </template>
            </v-text-field>
          </v-form>

          <span v-else>{{ $t("footer.newsletter.success") }}</span>
        </v-col>

        <v-col md="4" offset-md="1" cols="12" offset="0">
          <a href="mailto:geral@adiuvare.pt">geral@adiuvare.pt</a>
          <br >
          <a
            href="https://kehibvrmkdygejnd.public.blob.vercel-storage.com/pp-UDhf9fo8lpJMQUwNJeGnKkCpRyPGOe.pdf"
            target="_blank"
          >
            {{ $t("privacyPolicy") }}
          </a>
          <br >
          <a
            href="https://kehibvrmkdygejnd.public.blob.vercel-storage.com/eula-0aoyOz5t1i4QBJVcoh2BtkjWI7j73r.pdf"
            target="_blank"
          >
            {{ $t("eula") }}
          </a>
        </v-col>
      </v-row>

      <small class="text-center d-block mt-10">
        &copy; Adiuvare /
        <a href="https://www.cogniwave.pt/" target="blank" rel="noreferrer">Cogniwave</a> 2024
      </small>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import type { VForm } from "vuetify/components";

const email = ref("");
const submitting = ref(false);
const subscribed = ref(false);
const form = ref<VForm>();
const { errors, handleErrors, clearErrors } = useFormErrors();

const submit = async () => {
  clearErrors();

  if (!(await form.value?.validate())?.valid) {
    return;
  }

  submitting.value = true;

  await $fetch("/api/v1/newsletter", {
    method: "post",
    body: { email: email.value },
  })
    .then(() => (subscribed.value = true))
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
</script>

<style lang="scss" scoped>
:deep(.v-field--appended) {
  padding-right: 0 !important;
  --v-field-padding-end: 0 !important;
}

a {
  color: rgba(var(--v-theme-primary));
}

.v-footer {
  flex: initial;
}
</style>
