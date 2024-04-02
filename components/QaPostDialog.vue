<template>
  <v-dialog
    width="65vw"
    :model-value="$store.dialogVisible"
    @update:model-value="$store.closeDialog()"
  >
    <v-card>
      <v-card-title class="bg-primary">
        <h2 class="text-h5 text-white my-1">{{ $t("posts.title") }}</h2>
      </v-card-title>

      <v-card-text>
        <v-form
          ref="form"
          class="px-4 pt-4"
          validate-on="submit lazy"
          @submit.prevent="submit"
        >
          <!-- title -->
          <form-qa-input
            v-model:model-value="title"
            icon="title"
            :placeholder="$t('form.post.titlePlaceholder')"
            :label="$t('form.post.title')"
            :rules="[required]"
            :error="errors.title"
            @update:model-value="(value) => $store.updatePost('title', value)"
          />

          <!-- description -->
          <form-qa-textarea
            v-model:model-value="description"
            class="mt-5"
            icon="description"
            :placeholder="$t('form.post.descriptionPlaceholder')"
            :label="$t('form.post.description')"
            :rules="[required]"
            :error="errors.description"
            @update:model-value="
              (value) => $store.updatePost('description', value)
            "
          />

          <!-- locations -->
          <!-- TODO: improve ux on this -->
          <form-qa-autocomplete
            v-model:model-value="locationInput"
            multiple
            icon="map"
            class="mt-5"
            chips
            closable-chips
            :label="$t('form.post.location')"
            :placeholder="$t('form.post.locationPlaceholder')"
            :no-data-text="noDataText"
            :rules="[required]"
            :error="errors.locations"
            :items="locations"
            :loading="fetchingLocations"
            @update:search="fetchLocations"
            @update:model-value="onLocationUpdate"
            @click:remove-chip="onRemoveLocation"
          />

          <!-- category -->
          <form-qa-select
            v-model:model-value="categoryInput"
            multiple
            options-dense
            use-chips
            hide-hint
            icon="support"
            class="mt-5 mb-2"
            :label="$t('form.post.category')"
            :rules="[required]"
            :error="errors.category"
            :items="helpOptions"
            @update:model-value="onCategoryUpdate"
          >
            <template v-slot:chip="{ item }">
              <qa-post-dialog-need
                :key="item.value"
                :need="item.value"
                @click:remove="removeNeed(item.value)"
              />
            </template>
          </form-qa-select>

          <!-- horarios -->
          <!-- <label>Horário</label> -->
          <qa-post-schedule />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-5 d-flex flex-column">
        <v-btn
          type="submit"
          variant="tonal"
          color="primary"
          class="w-50 mb-2"
          :loading="submitting"
          @click="submit"
        >
          {{ $t("post.submit") }}
        </v-btn>

        <v-btn
          variant="flat"
          :disable="submitting"
          @click="$store.closeDialog()"
        >
          {{ $t("post.cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";

import type { SelectOption } from "@/types/form";

import { required } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { usePostsStore } from "@/stores/posts.store";
import { debounce } from "@/utils";
import { getCities } from "@/services/geoapify.service";
import QaPostDialogNeed from "./QaPostDialogNeed.vue";
import QaPostSchedule from "./scheduling/QaPostSchedule.vue";

const $store = usePostsStore();
const { errors, handleErrors, clearErrors } = useFormErrors();

const title = ref<string>("dsadsa");
const description = ref<string>("dsadsa");
const locationInput = ref<string[]>(["foo"]);
const locations = ref<string[]>([]);
const fetchingLocations = ref(false);
const noDataText = ref("Escreva para procurar morada");

const form = ref<VForm>();
const categoryInput = ref<string[]>(["money"]);
const helpOptions = ref<SelectOption[]>([
  { title: "Dinheiro", value: "money" },
  { title: "Voluntários", value: "volunteers" },
  { title: "Bens & comida", value: "goods" },
  { title: "Outros", value: "other" },
]);

const submitting = ref<boolean>(false);

watch(
  () => $store.dialogVisible,
  (val) => {
    if (!val) {
      return;
    }

    clearErrors();

    title.value = "";
    description.value = "";
    locationInput.value = [];
    categoryInput.value = [];
  },
);

const fetchLocations = (text: string) => {
  debounce(() => {
    if (fetchingLocations.value) {
      noDataText.value = "Procurando...";
      return;
    }

    if (text?.length <= 2) {
      locations.value = [];
      fetchingLocations.value = false;
      noDataText.value = "Escreva para procurar morada";
      return;
    }

    fetchingLocations.value = true;
    noDataText.value = "Procurando...";
    getCities(text)
      .then((cities) => {
        if (!cities?.length) {
          locations.value = [];
          noDataText.value = "Sem resultados";
        } else {
          locations.value = cities as string[];
        }
      })
      .finally(() => (fetchingLocations.value = false));
  });
};

const onRemoveLocation = (location: string) => {
  locationInput.value = locationInput.value.filter((l) => l !== location);
  onLocationUpdate();
};

const onLocationUpdate = () => {
  $store.updatePost("locations", locationInput.value);
};

const removeNeed = (category: string) => {
  categoryInput.value = categoryInput.value.filter((c) => category !== c);
  onCategoryUpdate();
};

const onCategoryUpdate = () => {
  $store.updatePost("needs", categoryInput.value);
};

const submit = async () => {
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  if (!(await form.value.validate())) {
    return;
  }

  clearErrors();
  submitting.value = true;

  $store
    .createPost()
    .catch(handleErrors)
    .finally(() => (submitting.value = false));
};
</script>

<style scoped>
.q-list {
  max-height: 200px;
  overflow: auto;
}
</style>
