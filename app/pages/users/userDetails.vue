<template>
  <template v-if="status === 'pending'">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <template v-if="currUser && Object.keys(currUser)">
    <div class="d-flex justify-end mb-1">
      <v-btn v-if="canEdit" variant="text" size="small" rounded="md" :to="`/profile`">
        <v-icon class="mr-1">fa-solid fa-pencil</v-icon>
        {{ t("form.edit") }}
      </v-btn>
    </div>

    <div class="bg-white rounded pa-5">
      <div class="d-flex align-center">
        <v-avatar size="100">
          <v-img :alt="t('posts.logoAlt')" :lazy-src="currUser.photoThumbnail">
            <template #error>
              <v-img :src="currUser.photo" cover referrerpolicy="same-origin" />
            </template>
          </v-img>
        </v-avatar>

        <h1 class="ml-5">{{ currUser.name }}</h1>
      </div>
    </div>

    <div v-if="currUser.bio" class="bg-white rounded pa-5 mt-3">
      <code>{{ currUser.bio }}</code>
    </div>

    <div v-if="currUser.contacts" class="bg-white rounded pa-5 mt-3">
      <ad-contacts-list :contacts="currUser.contacts" />
    </div>
  </template>
</template>

<script lang="ts" setup>
  import AdContactsList from "app/components/contacts/AdContactsList.vue";
  import { useUsers } from "app/store/users";
  import type { User } from "shared/types/user";

  const { currUser, setUser } = useUsers();

  const $route = useRoute();
  const { t } = useI18n();

  const {
    status,
    error,
  } = await useFetch<User>(`/api/users/${$route.params.slug}`, {
    lazy: true,

    onResponse({ response }) {
      setUser(response._data);
    },
  });

  definePageMeta({ path: "/users/:slug", title: "pages.userDetails" });

  const canEdit = ref(false);

  watch(
    () => error.value,
    (err) => {
      if (!err) {
        return;
      }

      throw createError(err);
    },
    { immediate: true },
  );


</script>