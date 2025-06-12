<template>
  <template v-if="status === 'pending'">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-if="currOrg && Object.keys(currOrg)">
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <v-btn variant="outlined" color="subtext" @click="$router.go(-1)">
          <v-icon>fa-chevron-left</v-icon>
          {{ t("posts.back") }}
        </v-btn>

        <!-- to be implemented later -->
        <!-- <v-btn variant="outlined" color="accent" class="ml-2" :to="`/organizations/${currOrg.slug}/edit`">
          <v-icon class="mr-1">fa-pencil</v-icon>
          {{ t("form.edit") }}
        </v-btn>

        <v-btn variant="outlined" color="secondary" class="ml-2" :to="`/organizations/${currOrg.slug}/members`">
          <v-icon class="mr-1">fa-users</v-icon>
          {{ t("orgs.members") }}
        </v-btn>

        <v-btn variant="outlined" color="secondary" class="ml-2" :to="`/organizations/${currOrg.slug}/posts`">
          <v-icon class="mr-1">fa-passport</v-icon>
          {{ t("orgs.posts") }}
        </v-btn> -->
      </div>

      <v-breadcrumbs :items="breadcrumbs" />
    </div>

    <v-row>
      <v-col cols="2">
        <app-avatar :alt="t('posts.logoAlt')" :src="currOrg.photo" :lazy-src="currOrg.photoThumbnail" />

        <div v-if="currOrg.contacts?.length">
          <h6>{{ t("orgs.contact") }}</h6>

          <app-contacts-list :contacts="currOrg.contacts" bg-color="transparent" />
        </div>

        <div v-if="currOrg.address">
          <h6>{{ t("orgs.morada") }}</h6>

          <span>
            {{ currOrg.address }}

            <app-external-link :href="`https://www.google.com/maps/place/${currOrg.address.replace(' ', '+')}`" />
          </span>
        </div>

        <div v-if="currOrg.website">
          <h6>{{ t("orgs.website") }}</h6>

          <span>
            {{ currOrg.website }}

            <app-external-link :href="currOrg.website" />
          </span>
        </div>

        <div v-if="currOrg.nipc">
          <h6>{{ t("orgs.nipc") }}</h6>

          <span>{{ currOrg.nipc }}</span>
        </div>
      </v-col>

      <v-col>
        <h3>{{ currOrg.name }}</h3>

        <small>{{ currOrg.category }}</small>

        <p v-if="currOrg.about" class="mt-3">
          {{ currOrg.about }}
        </p>

        <p v-else class="mt-3 font-italic">{{ t("orgs.noBio") }}</p>
      </v-col>
    </v-row>
  </template>
</template>

<script lang="ts" setup>
  import { useOrganizations } from "app/store/organizations";
  import AppAvatar from "app/components/common/AppAvatar.vue";
  import AppExternalLink from "app/components/common/AppExternalLink.vue";
  import AppContactsList from "app/components/contacts/AppContactsList.vue";

  import type { User } from "shared/types/user";

  const { currOrg, setOrg } = useOrganizations();
  const $router = useRouter();
  const $route = useRoute();
  const { t } = useI18n();

  const slug = $route.params.slug as string;

  const breadcrumbs = [
    { title: t("menu.home"), href: "/" },
    { title: t("orgs.title"), href: "/organizations" },
    { title: slug },
  ];

  definePageMeta({ path: "/organizations/:slug", title: "pages.orgDetails", layout: "full-width" });

  const { status, error } = await useFetch<User>(`/api/v1/organizations/${slug}`, {
    lazy: true,
    onResponse: ({ response }) => setOrg(response._data),
  });

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

  .about {
    white-space: pre-wrap;
  }
</style>
