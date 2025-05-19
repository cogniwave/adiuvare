<template>
  <v-skeleton-loader
    v-if="status === 'pending' || !currUser || !Object.keys(currUser).length"
    type="article@5"
    class="rounded-xl"
  />

  <ad-form-card v-else ref="form" :title="t('form.user.editDetails')" @submit="submit">
    <template #form>
      <v-input :error="!errors.file" :error-messages="errors.file" class="mb-8">
        <v-hover v-slot="{ isHovering, props }">
          <div v-bind="props" class="pic-wrapper" @click="fileInput?.click()">
            <input
              id="avatar"
              ref="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              class="d-none"
              @change="onFileChange"
            />

            <ad-img
              height="128px"
              width="128px"
              :alt="t('form.user.picAlt')"
              :src="pic"
              :lazy-src="currUser.photoThumbnail!"
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
        required
        :hint="t('form.user.slugHint')"
        :placeholder="t('form.user.slugPlaceholder')"
        :label="t('form.user.slug')"
        :rules="[required(t), maxLength($t, 264)]"
        :error-messages="errors.slug"
        @blur="onSlugBlur"
      />

      <!-- bio -->
      <v-textarea
        v-model:model-value="bio"
        class="my-10"
        prepend-icon="fa-solid fa-quote-left"
        :placeholder="t(currUser.type === 'org' ? 'form.org.bioPlaceholder' : 'form.user.bioPlaceholder')"
        :label="t(currUser.type === 'org' ? 'form.org.bio' : 'form.user.bio')"
        @update:model-value="(value) => updateUser('bio', value)"
      />

      <!-- website -->
      <v-text-field
        v-model:model-value="website"
        prepend-icon="fa-solid fa-globe"
        class="mb-8"
        persistent-counter
        counter="256"
        :placeholder="t('form.user.websitePlaceholder')"
        :label="t('form.user.website')"
        :rules="[maxLength($t, 256), isValidUrl($t)]"
        :error-messages="errors.website"
        @update:model-value="(value) => updateUser('website', value)"
      />

      <!-- morada -->
      <v-text-field
        v-model:model-value="address"
        prepend-icon="fa-solid fa-map"
        class="mb-8"
        persistent-counter
        counter="256"
        :placeholder="t('form.user.addressPlaceholder')"
        :label="t('form.user.address')"
        :rules="[maxLength($t, 256)]"
        :error-messages="errors.address"
        @update:model-value="(value) => updateUser('address', value)"
      />

      <!-- código postal -->
      <v-text-field
        v-model:model-value="postalCode"
        v-maska="'####-###'"
        prepend-icon="fa-solid fa-address-book"
        class="mb-8"
        persistent-counter
        counter="8"
        :placeholder="t('form.user.postalCodePlaceholder')"
        :label="t('form.user.postalCode')"
        :rules="[maxLength($t, 8)]"
        :error-messages="errors.postalCode"
        @update:model-value="(value) => updateUser('postalCode', value)"
      />

      <!-- city -->
      <v-autocomplete
        v-model:model-value="city"
        prepend-icon="fa-solid fa-map-location"
        class="mb-10"
        :items="localidades"
        :placeholder="t('form.user.cityPlaceholder')"
        :label="t('form.user.city')"
        :error-messages="errors.city"
        :no-data-text="t('form.post.locationNoResults')"
        :custom-filter="filterAutocomplete"
        @update:model-value="(value) => updateUser('city', value)"
      />

      <!-- district -->
      <v-autocomplete
        v-model:model-value="district"
        prepend-icon="fa-solid fa-location-dot"
        class="mb-8"
        :items="distritos"
        :placeholder="t('form.user.districtPlaceholder')"
        :label="t('form.user.district')"
        :no-data-text="t('form.post.locationNoResults')"
        :error-messages="errors.district"
        :custom-filter="filterAutocomplete"
        @update:model-value="(value) => updateUser('district', value)"
      />

      <!-- contacts -->
      <ad-contacts :contacts="contacts" :error="errors.contacts" @update="updateUser('contacts', $event)" />
    </template>

    <template #actions>
      <!-- todo: implement -->
      <!-- <v-btn :disable="submitting" color="error" class="mr-2" @click="$router.go(-1)">
        {{ t("form.user.delete") }}
      </v-btn> -->

      <v-spacer />

      <v-btn type="submit" variant="flat" color="primary" :loading="submitting">
        {{ t("form.user.update") }}
      </v-btn>
    </template>
  </ad-form-card>
</template>

<script lang="ts" setup>
  import { vMaska } from "maska/vue";
  import type { VForm } from "vuetify/lib/components/index.mjs";

  import AdImg from "app/components/common/AdImg.vue";
  import AdContacts from "app/components/contacts/AdContacts.vue";
  import AdFormCard from "app/components/common/AdFormCard.vue";
  import distritos from "public/assets/distritos.json";
  import localidades from "public/assets/localidades.json";

  import { fileSize, fileType } from "app/utils/validators";
  import { useUsers } from "app/store/users";

  import { useNotify } from "app/store/notify";
  import { normalize } from "app/utils";
  import type { User, UserContact } from "shared/types/user";
  import type { FilterMatch } from "shared/types/form";

  definePageMeta({ path: "/profile", middleware: "protected-server", title: "pages.profile" });

  const { user: auth, clear } = useUserSession();
  const { t } = useI18n();
  const $router = useRouter();
  const { users, currUser, setUser } = useUsers();
  const { notifyError, notifySuccess } = useNotify();
  const { errors, handleErrors, clearErrors } = useFormErrors();

  const userId = computed(() => auth.value?.id || "");

  // TODO: figure out why 2 requests are going off on page load
  // when loading directly profile
  const { error, execute, status } = useFetch<User>(() => `/api/v1/users/${userId.value}`, {
    lazy: true,
    immediate: false,
    onResponse({ response }) {
      const usr: User | null = response._data;

      if (!usr) {
        return;
      }

      initUser(usr);
      users.value.push(usr);
    },
  });

  const name = ref<string>("");
  const bio = ref<string>("");
  const slug = ref<string>("");
  const pic = ref<string>("");
  const contacts = ref<UserContact[]>([]);
  const website = ref<string>("");
  const address = ref<string>("");
  const postalCode = ref<string>("");
  const city = ref<string>();
  const district = ref<string>();

  const fileInput = ref<InstanceType<typeof HTMLInputElement> | null>(null);

  const form = ref<VForm>();

  const submitting = ref<boolean>(false);

  onBeforeMount(() => userId.value && status.value !== "pending" && init());

  const _updateUser = async () => {
    return await $fetch<User>(`/api/v1/users/${currUser.value.id}`, {
      query: { action: "profile" },
      body: {
        id: currUser.value.id,
        slug: currUser.value.slug,
        bio: currUser.value.bio,
        name: currUser.value.name,
        contacts: currUser.value.contacts,
        website: currUser.value.website,
        address: currUser.value.address,
        postalCode: currUser.value.postalCode,
        city: currUser.value.city,
        district: currUser.value.district,
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
      const requests: Array<ReturnType<typeof _updateUser | typeof _uploadFile>> = [_updateUser()];

      if (pic.value && pic.value !== currUser.value.photo) {
        requests.push(_uploadFile());
      }

      const [user, urls] = await Promise.all(requests);

      if (user) {
        users.value = users.value.map((p) => {
          return p.id === currUser.value.id ? { ...currUser.value, ...urls } : p;
        });
      }

      notifySuccess(t("form.user.updated"));
    } catch (errs: unknown) {
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
      return;
    }

    const f = files[0];

    const typeResult = fileType(t)(f!);
    if (typeof typeResult === "boolean") {
      const sizeResult = fileSize(t)(f!);

      if (typeof sizeResult === "boolean") {
        clearErrors();

        pic.value = URL.createObjectURL(f!);
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
      initUser(usr);
      status.value = "success";
    } else {
      execute().catch();
    }
  };

  const initUser = (user: User) => {
    name.value = user.name;
    slug.value = user.slug;
    bio.value = user.bio || "";
    website.value = user.website || "";
    address.value = user.address || "";
    postalCode.value = user.postalCode || "";
    city.value = user.city || undefined;
    district.value = user.district || undefined;
    contacts.value = user.contacts || [];
    pic.value = user.photo || "";

    setUser(user);
  };

  const filterAutocomplete = (value: string, query: string): FilterMatch => {
    return normalize(value).includes(normalize(query));
  };

  watch(
    () => error.value,
    (err) => {
      if (!err) {
        return;
      }

      if (err.statusCode === 404) {
        $router.push("/not-found");
      } else if (err.statusCode === 401) {
        clear().then(() => $router.push({ path: "/login", query: { requireAuth: "true" } }));
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
