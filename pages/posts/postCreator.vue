<template>
  <h2 class="text-h5 mb-5">{{ t("posts.newPostTitle") }}</h2>

  <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
    <div class="bg-white rounded px-10 py-5">
      <!-- title -->
      <v-text-field
        v-model:model-value="title"
        prepend-icon="fa-solid fa-heading"
        class="mb-10"
        :placeholder="t('form.post.titlePlaceholder')"
        :label="t('form.post.title')"
        :rules="[required(t)]"
        :error-messages="errors.title"
        @update:model-value="(value) => updatePost('title', value)"
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
        v-model:model-value="categoryInput"
        multiple
        options-dense
        use-chips
        hide-hint
        prepend-icon="fa-solid fa-parachute-box"
        class="mt-10"
        :label="t('form.post.category')"
        :rules="[required(t)]"
        :error-messages="errors.category"
        :items="helpOptions"
        @update:model-value="updatePost('needs', $event)"
      >
        <template v-slot:chip="{ item }">
          <ad-post-dialog-need
            :key="item.value"
            :need="item.value"
            @click:remove="removeNeed(item.value)"
          />
        </template>
      </v-select>
    </div>

    <div class="bg-white rounded px-10 py-5">
      <!-- contacts -->
      <ad-contacts v-if="user" :contacts="user.contacts" @update="updatePost('contacts', $event)" />

      <!-- horarios -->
      <ad-post-schedule />
    </div>
  </v-form>

  <div class="py-5 d-flex align-center justify-end">
    <v-btn :disable="submitting" class="mr-2" @click="$router.go(-1)">
      {{ t("posts.cancel") }}
    </v-btn>

    <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
      {{ t("posts.submit") }}
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { VForm } from "vuetify/lib/components/index.mjs";

import { required } from "@/utils/validators";
import { useFormErrors } from "@/composables/formErrors";
import { debounce } from "@/utils";
import { getCities } from "@/services/geoapify.service";
import AdPostDialogNeed from "@/components/posts/AdPostDialogNeed.vue";
import AdPostSchedule from "@/components/posts/AdPostSchedule.vue";
import { useNotify } from "@/store/notify";
import { usePosts } from "@/store/posts";
import { useAuth } from "@/store/auth";

import type { SelectOption } from "@/types/form";
import type { EmptyPost, Post, PostSchedule } from "@/types/post";
import type { User, UserContact } from "@/types/user";

definePageMeta({ path: "/posts/new", middleware: "org-only", title: "pages.postCreate" });

const { notifySuccess } = useNotify();
const { t } = useI18n();
const { errors, handleErrors, clearErrors } = useFormErrors();
const { currPost, posts, setPost } = usePosts();
const $router = useRouter();
const { data: user } = useAuth();

const title = ref<string>("");
const description = ref<string>("");
const locationInput = ref<string[]>([]);
const locations = ref<string[]>([]);
const fetchingLocations = ref(false);
const noDataText = ref(t("form.post.locationNoFilter"));

const form = ref<VForm>();
const categoryInput = ref<string[]>([]);
const helpOptions = ref<SelectOption[]>([
  { title: t("posts.needs.money"), value: "money" },
  { title: t("posts.needs.volunteers"), value: "volunteers" },
  { title: t("posts.needs.goods"), value: "goods" },
  { title: t("posts.needs.other"), value: "other" },
]);

const submitting = ref<boolean>(false);

onBeforeMount(() => {
  setPost({ contacts: (user.value as User).contacts, schedule: { type: "anytime" } } as EmptyPost);
});

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

const updatePost = (prop: string, val: string | string[] | PostSchedule | UserContact[]) => {
  currPost.value = { ...currPost.value, [prop]: val };
};

const removeNeed = (category: string) => {
  categoryInput.value = categoryInput.value.filter((c) => category !== c);
  updatePost("needs", categoryInput.value);
};

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
    const post = await $fetch<Post>("/api/v1/posts", { body: currPost.value, method: "post" });

    if (post) {
      posts.value.push(post);
    }

    currPost.value = {} as Post;
    $router.push("/");
    notifySuccess(t("posts.created"));
  } catch (errs: any) {
    handleErrors(errs);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
:deep(.v-card) {
  background-color: rgba(var(--v-theme-surface));
}
</style>
