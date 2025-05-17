<template>
  <ad-form-card ref="form" :title="t('posts.newPostTitle')" @submit="submit">
    <template #form>
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

      <!-- locations -->
      <!-- TODO: improve ux on this -->
      <v-autocomplete
        v-model:model-value="locationInput"
        multiple
        prepend-icon="fa-solid fa-location-dot"
        chips
        class="mt-10"
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
        <template #chip="{ item }">
          <ad-post-dialog-need :key="item.value" :need="item.value" @click:remove="removeNeed(item.value)" />
        </template>
      </v-select>

      <!-- contacts -->
      <ad-contacts
        v-if="user"
        :contacts="user.contacts"
        :error="errors.contacts"
        @update="updatePost('contacts', $event)"
      />

      <!-- horarios -->
      <ad-post-schedule />
    </template>

    <template #actions>
      <v-btn :disable="submitting" variant="text" color="secondary" class="mr-2" @click="$router.go(-1)">
        {{ t("posts.cancel") }}
      </v-btn>

      <v-btn type="submit" variant="flat" color="primary" :loading="submitting" @click="submit">
        {{ t("posts.submit") }}
      </v-btn>
    </template>
  </ad-form-card>
</template>

<script lang="ts" setup>
  import type { VForm } from "vuetify/lib/components/index.mjs";

  import { required } from "app/utils/validators";
  import { useFormErrors } from "app/composables/formErrors";
  import { debounce } from "app/utils";
  import { getCities } from "app/services/geoapify.service";
  import AdPostDialogNeed from "app/components/posts/AdPostDialogNeed.vue";
  import AdPostSchedule from "app/components/posts/AdPostSchedule.vue";
  import AdContacts from "app/components/contacts/AdContacts.vue";
  import AdFormCard from "app/components/common/AdFormCard.vue";
  import { useNotify } from "app/store/notify";
  import { usePosts } from "app/store/posts";

  import type { SelectOption } from "shared/types/form";
  import type { EmptyPost, Post, PostSchedule } from "shared/types/post";
  import type { UserContact } from "shared/types/user";

  definePageMeta({ path: "/posts/new", middleware: "org-only-server", title: "pages.postCreate" });

  const { notifySuccess } = useNotify();
  const { t } = useI18n();
  const { errors, handleErrors, clearErrors } = useFormErrors();
  const { currPost, posts, setPost } = usePosts();
  const $router = useRouter();
  const { user } = useUserSession();

  const title = ref<string>("");
  const description = ref<string>("");
  const locationInput = ref<string[]>([]);
  const locations = ref<string[]>([]);
  const fetchingLocations = ref(false);
  const noDataText = ref(t("form.post.locationNoData"));

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
    setPost({ contacts: user.value!.contacts, schedule: { type: "anytime" } } as EmptyPost);
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
        noDataText.value = t("form.post.locationNoData");
        return;
      }

      fetchingLocations.value = true;
      noDataText.value = t("form.post.locationSearching");
      getCities(text)
        .then((cities) => {
          if (!cities?.length) {
            locations.value = [];
            noDataText.value = t("form.post.locationNoData");
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
    } catch (errs: unknown) {
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
