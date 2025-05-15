<template>
  <v-footer color="surface" elevation="7" class="pt-5 pb-2 flex-column">
    <div class="w-100">
      <v-row>
        <v-col md="4" offset-md="2" cols="12" offset="0">
          {{ $t("footer.newsletter.text") }}

          <v-form v-if="!subscribed" ref="form" validate-on="submit lazy" class="mt-2" @submit.prevent="submit">
            <v-text-field
              v-model:model-value="email"
              type="text"
              class="w-100"
              density="compact"
              variant="outlined"
              placeholder="email@gmail.com"
              :label="$t('footer.newsletter.label')"
              :error-messages="errors.email"
            >
              <template #append-inner>
                <v-btn
                  type="submit"
                  color="primary"
                  variant="flat"
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
          <br />
          <a href="assets/pp.pdf" target="_blank">
            {{ $t("privacyPolicy") }}
          </a>
          <br />
          <a href="assets/eula.pdf" target="_blank">
            {{ $t("eula") }}
          </a>
        </v-col>
      </v-row>

      <small class="text-center d-block mt-10">
        &copy; Adiuvare /
        <a href="https://www.cogniwave.pt/" target="blank" rel="noreferrer">Cogniwave</a> 2025
      </small>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
  import type { VForm } from "vuetify/lib/components/index.mjs";

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
  .v-footer {
    max-height: 200px;

    :deep(.v-field) {
      overflow: hidden;

      &.v-field--appended {
        padding: 0 !important;
      }

      button {
        height: 100%;
      }
    }

    a {
      color: rgba(var(--v-theme-primary));
    }
  }
</style>
