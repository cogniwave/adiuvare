<template>
  <template v-if="pending || !currUser || !Object.keys(currUser).length">
    <v-skeleton-loader type="article@5" class="rounded-xl" />
  </template>

  <!-- render users -->
  <template v-else>
    <h2 class="text-h5 mb-5">{{ t("form.user.editDetails") }}</h2>

    <v-form ref="form" validate-on="submit lazy" @submit.prevent="submit">
      <div class="bg-white rounded px-10 py-5">
        <v-input :error="!errors.file" :error-messages="errors.file" class="mb-8">
          <v-hover v-slot="{ isHovering, props }">
            <div v-bind="props" class="pic-wrapper" @click="fileInput?.click()">
              <input
                ref="fileInput"
                id="avatar"
                type="file"
                accept="image/png, image/jpeg"
                class="d-none"
                @change="onFileChange"
              />

              <qa-img
                height="128px"
                width="128px"
                :alt="t('form.user.picAlt')"
                :src="pic"
                :lazy-src="currUser.photoThumbnail"
              />

              <v-fade-transition>
                <div v-show="isHovering" class="camera-wrapper">
                  <v-icon color="white" size="large"> fa-solid fa-camera </v-icon>
                </div>
              </v-fade-transition>
            </div>
          </v-hover>
        </v-input>

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
          :placeholder="
            t(currUser.type === 'org' ? 'form.org.bioPlaceholder' : 'form.user.bioPlaceholder')
          "
          :label="t(currUser.type === 'org' ? 'form.org.bio' : 'form.user.bio')"
          @update:model-value="(value) => updateUser('bio', value)"
        />
      </div>

      <div class="bg-white rounded px-10 py-5">
        <!-- contacts -->
        <qa-contacts :contacts="contacts" @update="updateUser('contacts', $event)" />
      </div>
    </v-form>

    <div class="py-5 d-flex align-center justify-end">
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

import { fileSize, fileType } from "@/utils/validators";
import { useUsers } from "@/store/users";
import { useAuth } from "@/store/auth";
import { useNotify } from "@/store/notify";
import type { User, UserContact } from "@/types/user";

definePageMeta({ path: "/profile", middleware: "protected", title: "pages.profile" });

const { data: auth, logout } = useAuth();
const { t } = useI18n();
const $router = useRouter();
const { users, currUser, setUser } = useUsers();
const { notifyError, notifySuccess } = useNotify();
const { errors, handleErrors, clearErrors } = useFormErrors();

const userId = computed(() => auth.value?.id || "");

const { data, error, pending, execute } = useFetch<User>(() => `/api/v1/users/${userId.value}`, {
  lazy: true,
  immediate: false,
});

const name = ref<string>("");
const bio = ref<string>("");
const slug = ref<string>("");
const pic = ref<string>("");
const contacts = ref<UserContact[]>([]);

const fileInput = ref<InstanceType<typeof HTMLInputElement> | null>(null);

const form = ref<VForm>();

const submitting = ref<boolean>(false);

onBeforeMount(() => userId.value && init());

const _updateUser = async () => {
  return await $fetch<User>(`/api/v1/users/${currUser.value.id}`, {
    query: { action: "profile" },
    body: {
      id: currUser.value.id,
      slug: currUser.value.slug,
      bio: currUser.value.bio,
      name: currUser.value.name,
      contacts: currUser.value.contacts,
    },
    method: "patch",
  });
};

const _uploadFile = async () => {
  const formData = new FormData();

  if (!fileInput.value) {
    return;
  }

  // @ts-expect-error TS will complain that files is not the correct type
  formData.append("file", fileInput.value.files?.[0]);

  return await $fetch<User>(`/api/v1/users/${currUser.value.id}/photo`, {
    body: formData,
    method: "post",
  });
};

const submit = async () => {
  // won't really happen, but keeps linter happy
  if (!form.value) {
    return;
  }

  const result = await form.value.validate();
  if (!result.valid || !!errors.value.file) {
    return;
  }

  clearErrors();
  submitting.value = true;

  try {
    const requests: any[] = [_updateUser()];

    if (pic.value !== currUser.value.photo) {
      requests.push(_uploadFile());
    }

    const [user, urls] = await Promise.all(requests);

    if (user) {
      users.value = users.value.map((p) => {
        return p.id === currUser.value.id ? { ...currUser.value, ...urls } : p;
      });
    }

    notifySuccess(t("form.user.updated"));
  } catch (errs: any) {
    handleErrors(errs);
  } finally {
    submitting.value = false;
  }
};

const updateUser = (prop: string, val: string | UserContact[]) => {
  currUser.value = { ...currUser.value, [prop]: val };
};

const onSlugBlur = () => {
  slug.value = slug.value.replaceAll(/[^A-Za-z0-9]/g, "-");
  updateUser("slug", slug.value);
};

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;

  if (!files?.length) {
    return t("errors.required");
  }

  const f = files[0];
  const typeResult = fileType(t)(f);
  if (typeof typeResult === "boolean") {
    const sizeResult = fileSize(t)(f);

    if (typeof sizeResult === "boolean") {
      clearErrors();

      pic.value = URL.createObjectURL(f);
    } else {
      errors.value.file = sizeResult;
    }
  } else {
    errors.value.file = typeResult;
  }
};

const init = () => {
  const usr = (users.value || []).find(({ id }) => id === userId.value);

  if (usr) {
    setUser(usr);
    pending.value = false;
  } else {
    execute().catch();
  }
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
    pic.value = usr.photo || "";
    contacts.value = usr.contacts || [];

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
    } else if (err.statusCode === 401) {
      logout().then(() => $router.push({ path: "/login", query: { requireAuth: "true" } }));
    } else {
      notifyError(t("errors.fetchUser"));
      $router.push("/");
    }
  },
  { immediate: true },
);

watch(() => userId.value, init);
</script>

<style scoped lang="scss">
.pic-wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 100px;
  width: 128px;
  display: block;
  margin: auto;

  .camera-wrapper {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
}
</style>
