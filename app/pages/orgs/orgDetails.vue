<template>
  <template v-if="pending">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-if="currOrg && Object.keys(currOrg)">
    <div class="d-flex mb-1">
      <v-btn variant="text" size="small" @click="$router.go(-1)">
        <v-icon>fa-solid fa-chevron-left</v-icon>
        {{ t("posts.back") }}
      </v-btn>

      <v-btn
        v-if="canEdit"
        variant="text"
        size="small"
        rounded="md"
        class="ml-auto"
        :to="`/organiations/${currOrg.slug}/edit`"
      >
        <v-icon class="mr-1">fa-solid fa-pencil</v-icon>
        {{ t("form.edit") }}
      </v-btn>
    </div>

    <div class="bg-white rounded pa-5">
      <div class="d-flex align-center">
        <v-avatar size="100">
          <v-img :alt="t('posts.logoAlt')" :src="currOrg.photo" :lazy-src="currOrg.photoThumbnail">
            <template #error>
              <v-img :src="currOrg.photoThumbnail" cover referrerpolicy="same-origin" />
            </template>
          </v-img>
        </v-avatar>

        <div class="ml-5">
          <h1>{{ currOrg.name }}</h1>

          <v-list-item
            v-if="currOrg.address || currOrg.postalCode || currOrg.city || currOrg.district"
            density="compact"
            class="px-0"
            :title="currOrg.address"
            :subtitle="`${currOrg.postalCode} ${currOrg.city} ${currOrg.district}`.trim()"
          />

          <v-list-item v-if="currOrg.website" density="compact" class="px-0" :title="currOrg.website" />
        </div>
      </div>
    </div>

    <div v-if="currOrg.bio" class="bg-white rounded pa-5 mt-3">
      <div class="bio">{{ currOrg.bio }}</div>
    </div>

    <div v-if="currOrg.contacts?.length" class="bg-white rounded pa-5 mt-3">
      <ad-contacts-list :contacts="currOrg.contacts" bg-color="transparent" />
    </div>
  </template>
</template>

<script lang="ts" setup>
  import { useOrganizations } from "app/store/organizations";

  import type { User } from "shared/types/user";

  const { currOrg, setOrg } = useOrganizations();
  const $router = useRouter();
  const $route = useRoute();
  const { user } = useUserSession();
  const { t } = useI18n();

  const slug = $route.params.slug as string;

  definePageMeta({ path: "/organizations/:slug", title: "pages.orgDetails" });

  const {
    data: org,
    pending,
    error,
  } = await useFetch<User>(`/api/v1/organizations/${slug}`, {
    lazy: true,
    onResponse({ response }) {
      setOrg(response._data);
    },
  });

  const canEdit = computed(() => org.value?.slug === user.value?.slug);

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

<style lang="scss" scoped>
  a {
    color: initial;
  }

  span {
    font-weight: initial;
    font-size: initial;
    line-height: initial;
  }

  .bio {
    white-space: pre-wrap;
  }
</style>
