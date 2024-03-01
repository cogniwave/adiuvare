<template>
  <v-dialog
    width="65vw"
    :model-value="$store.dialogVisible"
    @update:model-value="$store.closeDialog()"
  >
    <v-card>
      <v-card-title class="bg-primary">
        <h2 class="text-h5 text-white my-1">Nova publicação</h2>
      </v-card-title>

      <v-card-text>
        <v-form
          class="px-4 pt-4"
          validate-on="submit lazy"
          @submit.prevent="submit"
        >
          <!-- title -->
          <form-qa-input
            v-model:model-value="title"
            label="Título"
            icon="title"
            placeholder="E.g.: Precisa-se voluntário para ajudar com a distribuição de comida às sextas à noite"
            :rules="[required]"
            :error="errors.title"
            @update:model-value="(value) => $store.updatePost('title', value)"
          />

          <!-- description -->
          <form-qa-textarea
            v-model:model-value="description"
            label="Descrição"
            class="mt-5"
            icon="description"
            placeholder="E.g.: Precisa-se voluntário"
            :rules="[required]"
            :error="errors.description"
            @update:model-value="(value) => $store.updatePost('title', value)"
          />

          <!-- locations -->
          <!-- TODO: improve ux on this -->
          <form-qa-autocomplete
            v-model:model-value="locationInput"
            multiple
            label="Área(s) de atuação"
            placeholder="E.g.: Barreiro; Bombarral; Lisboa"
            icon="map"
            class="mt-5"
            chips
            closable-chips
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
            label="Que ajuda precisa"
            class="mt-5 mb-2"
            :rules="[required]"
            :error="errors.category"
            :items="helpOptions"
            @update:model-value="onCategoryUpdate"
          >
            <template v-slot:chip="{ item }">
              <qa-post-tag
                :key="item.value"
                :tag="item.value"
                closable
                @click:remove="removeCategory(item.value)"
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
          Criar publicação
        </v-btn>

        <v-btn
          variant="flat"
          :disable="submitting"
          @click="$store.closeDialog()"
        >
          Cancelar
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
import { usePostsStore } from "@/stores/posts";
import { debounce } from "@/utils";
import { getCities } from "@/services/geoapify.service";
import QaPostTag from "./QaPostTag.vue";
import QaPostSchedule from "./scheduling/QaPostSchedule.vue";

const $store = usePostsStore();
const { errors, hasErrors, handleErrors, clearErrors } = useFormErrors();

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
  { title: "Voluntários", value: "people" },
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

const removeCategory = (category: string) => {
  categoryInput.value = categoryInput.value.filter((c) => category !== c);
  onCategoryUpdate();
};

const onCategoryUpdate = () => {
  $store.updatePost("categories", categoryInput.value);
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
