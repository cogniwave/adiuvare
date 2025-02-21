<template>
  <template v-if="pending">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render users -->
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
  import { useRoute, useRouter } from "vue-router";

  import AdContactsList from "@/components/contacts/AdContactsList.vue";
  import { useUsers } from "@/store/users";
  import { useAuth } from "@/store/auth";
  import { useNotify } from "@/store/notify";

  import type { User } from "@/types/user";

  definePageMeta({
    title: "pages.userDetails",
    path: "/users/:slug",
  });

  const { data: auth } = useAuth();
  const { t } = useI18n();
  const $route = useRoute();
  const $router = useRouter();
  const { users, currUser, setUser } = useUsers();
  const { notifyError } = useNotify();

  const _slug = $route.params.slug as string;

  const { pending, error } = await useFetch<User>(`/api/v1/users/${_slug}`, {
    lazy: true,
    immediate: false,
    onResponse({ response }) {
      setUser(response._data);
    },
  });

  const canEdit = computed(() => currUser.value?.slug === auth.value?.slug);

  onBeforeMount(() => {
    const usr = users.value.find(({ slug }) => slug === _slug);

    if (usr) {
      setUser(usr);
    }
  });

  watch(
    () => error.value,
    (err) => {
      if (err) {
        $router.push("/not-found");
        notifyError(t("errors.fetchUser"));
      }
    },
  );
</script>
