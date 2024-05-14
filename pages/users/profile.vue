<template>
  <template v-if="pending || !currUser || !Object.keys(currUser).length">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render users -->
  <template v-else>
    <h2 class="text-h5 mb-5">{{ t("form.user.editDetails") }}</h2>

    <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
      <div class="bg-white rounded px-10 py-5">
        <!-- name -->
        <v-text-field
          v-model:model-value="name"
          prepend-icon="fa-solid fa-heading"
          class="mb-8"
          counter="264"
          persistent-counter
          :placeholder="t('form.user.namePlaceholder')"
          :label="t('form.user.name')"
          :rules="[required(t), maxLength($t, 264)]"
          :error-messages="errors.name"
          @update:model-value="(value) => updateUser('name', value)"
        />

        <!-- slug -->
        <v-text-field
          v-model:model-value="slug"
          prepend-icon="fa-solid fa-id-badge"
          class="mb-8"
          persistent-counter
          counter="264"
          :hint="t('form.user.slugHint')"
          :placeholder="t('form.user.slugPlaceholder')"
          :label="t('form.user.slug')"
          :rules="[required(t)]"
          :error-messages="errors.slug"
          @blur="onSlugBlur"
        />

        <!-- bio -->
        <v-textarea
          v-model:model-value="bio"
          class="mt-10"
          prepend-icon="fa-solid fa-quote-left"
          :placeholder="t('form.user.bioPlaceholder')"
          :label="t('form.user.bio')"
          @update:model-value="(value) => updateUser('bio', value)"
        />
      </div>

      <div class="bg-white rounded px-10 py-5">
        <!-- contacts -->
        <qa-contacts />
      </div>
    </v-form>

    <div class="py-5 d-flex align-center justify-end">
      <v-btn :disable="submitting" color="error" class="mr-2" @click="$router.go(-1)">
        {{ t("form.user.delete") }}
      </v-btn>

      <v-spacer />

      <v-btn :disable="submitting" class="mr-2" @click="$router.go(-1)">
        {{ t("form.cancel") }}
      </v-btn>

      <v-btn type="submit" color="primary" :loading="submitting" @click="submit">
        {{ t("form.user.update") }}
      </v-btn>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

import { useUsers } from "@/composables/users";
import type { User } from "@/types/user";

definePageMeta({ layout: "default", path: "/profile", middleware: "protected" });

const { data: auth } = useAuth();

const { t } = useI18n();
const $router = useRouter();
const { users, currUser, setUser } = useUsers();
const { notifyError, notifySuccess } = useNotify();
const { errors, handleErrors, clearErrors } = useFormErrors();

const _slug = computed(() => auth.value?.slug || "");

const { data, error, pending, execute } = useFetch<User>(`/api/v1/users/${currUser.value.id}`, {
  lazy: true,
  immediate: false,
});

const name = ref<string>("");
const bio = ref<string>("");
const form = ref<VForm>();
const slug = ref<string>(_slug.value);

const submitting = ref<boolean>(false);

onBeforeMount(() => {
  const usr = (users.value || []).find(({ slug }) => slug === _slug.value);

  if (usr) {
    setUser(usr);
    pending.value = false;
  } else {
    execute().catch();
  }
});

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
    const user = await $fetch<User>(`/api/v1/users/${currUser.value.id}`, {
      body: {
        id: currUser.value.id,
        slug: currUser.value.slug,
        bio: currUser.value.bio,
        name: currUser.value.name,
        contacts: currUser.value.contacts,
      },
      method: "patch",
    });

    if (user) {
      users.value = users.value.map((p) => (p.id === currUser.value.id ? currUser.value : p));
    }

    notifySuccess(t("users.updated"));
  } catch (errs: any) {
    handleErrors(errs);
  } finally {
    submitting.value = false;
  }
};

const updateUser = (prop: string, val: string) => {
  currUser.value = { ...currUser.value, [prop]: val };
};

const onSlugBlur = () => {
  slug.value = slug.value.replaceAll(/[^A-Za-z0-9]/g, "-");
  updateUser("slug", slug.value);
};

watch(
  () => data.value,
  (usr) => {
    if (!usr) {
      return;
    }

    name.value = usr.name;
    bio.value = usr.bio || "";
    slug.value = usr.slug;

    users.value.push(usr);
    setUser(usr);
  },
);

watch(
  () => error.value,
  (err) => {
    if (!err) {
      return;
    }

    if (err.statusCode === 404) {
      $router.push("/not-found");
    } else {
      notifyError(t("errors.fetchUser"));
      $router.push("/");
    }
  },
  { immediate: true },
);
</script>
