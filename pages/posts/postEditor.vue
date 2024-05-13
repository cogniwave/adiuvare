<template>
  <template v-if="pending">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-else>
    <h2 class="text-h5 mb-5">{{ t("posts.editPostTitle") }}</h2>

    <v-form v-if="post" ref="form" validate-on="submit lazy" @submit.prevent="submit">
      <div class="bg-white rounded px-10 py-5">
        <!-- title -->
        <v-text-field
          v-model:model-value="title"
          prepend-icon="fa-solid fa-heading"
          class="mb-8"
          counter="264"
          persistent-counter
          :placeholder="t('form.post.titlePlaceholder')"
          :label="t('form.post.title')"
          :rules="[required(t), maxLength($t, 264)]"
          :error-messages="errors.title"
          @update:model-value="(value) => updatePost('title', value)"
        />

        <!-- slug -->
        <v-text-field
          v-model:model-value="slug"
          prepend-icon="fa-solid fa-id-badge"
          class="mb-8"
          persistent-counter
          counter="264"
          :hint="t('form.post.slugHint')"
          :placeholder="t('form.post.slugPlaceholder')"
          :label="t('form.post.slug')"
          :rules="[required(t)]"
          :error-messages="errors.slug"
          @blur="onSlugBlur"
        />

        <!-- description -->
        <v-textarea
          v-model:model-value="description"
          class="mt-10"
          prepend-icon="fa-solid fa-quote-left"
          :placeholder="t('form.post.descriptionPlaceholder')"
          :label="t('form.post.description')"
          :rules="[required(t)]"
          :error-messages="errors.description"
          @update:model-value="(value) => updatePost('description', value)"
        />

        <!-- state -->
        <v-input prepend-icon="fa-solid fa-film" hide-details class="mt-10">
          <v-label class="mr-2"> {{ t("form.post.state.title") }} </v-label>

          <v-btn-toggle
            v-if="['active', 'inactive'].includes(post.state)"
            v-model:model-value="state"
            divided
            color="primary"
            density="compact"
            class="ml-auto"
          >
            <v-tooltip :text="t('form.post.state.activeTooltip')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  value="active"
                  @update:model-value="updatePost('state', 'active')"
                >
                  {{ t("form.post.state.active") }}
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip :text="t('form.post.state.inactiveTooltip')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="x-small"
                  value="inactive"
                  @update:model-value="updatePost('state', 'inactive')"
                >
                  {{ t("form.post.state.inactive") }}
                </v-btn>
              </template>
            </v-tooltip>
          </v-btn-toggle>

          <template v-else>
            <v-tooltip :text="t(`form.post.state.${post.state}Tooltip`)">
              <template v-slot:activator="{ props }">
                {{ t(`form.post.state.${post.state}`) }}

                <v-icon v-bind="props" color="primary" class="ml-1">
                  fa-solid fa-circle-question
                </v-icon>
              </template>
            </v-tooltip>
          </template>
        </v-input>
      </div>

      <div class="bg-white rounded px-10 py-5 my-5">
        <!-- locations -->
        <!-- TODO: improve ux on this -->
        <v-autocomplete
          v-model:model-value="locationInput"
          multiple
          prepend-icon="fa-solid fa-location-dot"
          chips
          closable-chips
          :label="t('form.post.location')"
          :placeholder="t('form.post.locationPlaceholder')"
          :no-data-text="noDataText"
          :rules="[required(t)]"
          :error-messages="errors.locations"
          :items="locations"
          :loading="fetchingLocations"
          @update:search="fetchLocations"
          @update:model-value="updatePost('locations', $event)"
          @click:remove-chip="onRemoveLocation"
        />

        <!-- category -->
        <v-select
          v-model:model-value="needs"
          multiple
          use-chips
          prepend-icon="fa-solid fa-parachute-box"
          clearable
          class="mt-10"
          :label="t('form.post.category')"
          :rules="[required(t)]"
          :error-messages="errors.category && t(errors.category)"
          :items="needOptions"
          @update:model-value="updatePost('needs', $event)"
        >
          <template v-slot:chip="{ item }">
            <qa-post-dialog-need
              :key="item.value"
              :need="item.value"
              @click:remove="removeNeed(item.value)"
            />
          </template>
        </v-select>
      </div>

      <div class="bg-white rounded px-10 py-5">
        <!-- contacts -->
        <qa-post-contacts />

        <!-- horarios -->
        <qa-post-schedule />
      </div>
    </v-form>

    <div class="py-5 d-flex align-center justify-end">
      <v-btn :disable="submitting" class="mr-2" @click="$router.go(-1)">
        {{ t("posts.cancel") }}
      </v-btn>

      <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
        {{ t("posts.update") }}
      </v-btn>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";

import type { SelectOption } from "@/types/form";

import { required, maxLength } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { debounce } from "@/utils";
import { getCities } from "@/services/geoapify.service";
import QaPostDialogNeed from "@/components/posts/QaPostDialogNeed.vue";
import QaPostSchedule from "@/components/posts/QaPostSchedule.vue";
import type { Post, PostSchedule, PostState } from "@/types/post";

definePageMeta({ path: "/posts/:slug/edit", middleware: "is-owner" });

const { notifySuccess } = useNotify();
const { t } = useI18n();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { currPost, posts, setPost } = usePosts<Post>();
const $route = useRoute();
const $router = useRouter();

const _slug = $route.params.slug as string;

const {
  data: post,
  pending,
  execute,
} = useFetch<Post>(`/api/v1/posts/${_slug}`, { lazy: true, immediate: false });

onBeforeMount(execute);

const title = ref<string>("");
const description = ref<string>("");
const locationInput = ref<string[]>([]);
const locations = ref<string[]>([]);
const fetchingLocations = ref(false);
const noDataText = ref(t("form.post.locationNoFilter"));
const form = ref<VForm>();
const slug = ref<string>(_slug);
const state = ref<PostState>("pending");
const needs = ref<string[]>([]);
const needOptions = ref<SelectOption[]>([
  { title: t("posts.needs.money"), value: "money" },
  { title: t("posts.needs.volunteers"), value: "volunteers" },
  { title: t("posts.needs.goods"), value: "goods" },
  { title: t("posts.needs.other"), value: "other" },
]);

const submitting = ref<boolean>(false);

const fetchLocations = (text: string) => {
  debounce(() => {
    if (fetchingLocations.value) {
      noDataText.value = t("form.post.locationSearching");
      return;
    }

    if (text?.length <= 2) {
      locations.value = [];
      fetchingLocations.value = false;
      noDataText.value = t("form.post.locationNoFilter");
      return;
    }

    fetchingLocations.value = true;
    noDataText.value = t("form.post.locationSearching");
    getCities(text)
      .then((cities) => {
        if (!cities?.length) {
          locations.value = [];
          noDataText.value = t("form.post.locationNoFilter");
        } else {
          locations.value = cities as string[];
        }
      })
      .finally(() => (fetchingLocations.value = false));
  });
};

const onRemoveLocation = (location: string) => {
  locationInput.value = locationInput.value.filter((l) => l !== location);
  updatePost("location", locationInput.value);
};

const updatePost = (prop: string, val: string | string[] | PostSchedule) => {
  currPost.value = { ...currPost.value, [prop]: val };
};

const removeNeed = (category: string) => {
  needs.value = needs.value.filter((c) => category !== c);
  updatePost("needs", needs.value);
};

const submit = async () => {
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  const result = await form.value.validate();
  if (!result.valid) {
    return;
  }

  clearErrors();
  submitting.value = true;

  try {
    const post = await $fetch<Post>(`/api/v1/posts/${_slug}`, {
      body: currPost.value,
      method: "patch",
    });

    if (post) {
      posts.value = posts.value.map((p) => (p.id === currPost.value.id ? currPost.value : p));
    }

    $router.push(`/posts/${_slug}`);
    notifySuccess(t("posts.updated"));
  } catch (errs: any) {
    handleErrors(errs);
  } finally {
    submitting.value = false;
  }
};

const onSlugBlur = () => {
  slug.value = slug.value.replaceAll(/[^A-Za-z0-9]/g, "-");
  updatePost("slug", slug.value);
};

watch(
  () => post.value,
  (post) => {
    if (post) {
      title.value = post.title;
      description.value = post.description;
      slug.value = post.slug;
      state.value = post.state;
      locationInput.value = post.locations;
      locations.value = post.locations;
      needs.value = post.needs;
      setPost({ ...post });
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
:deep(.v-card) {
  background-color: rgba(var(--v-theme-surface));
}
</style>
