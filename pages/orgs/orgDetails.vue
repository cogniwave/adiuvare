<template>
  <template v-if="pending">
    <v-skeleton-loader type="card" class="rounded-xl mt-5" />
    <v-skeleton-loader type="list-item@3" class="rounded-xl mt-5" />
  </template>

  <template v-if="currOrg && Object.keys(currOrg)">
    <div class="d-flex justify-end mb-1">
      <v-btn
        v-if="canEdit"
        variant="text"
        size="small"
        rounded="md"
        :to="`/organiations/${currOrg.slug}/edit`"
      >
        <v-icon class="mr-1">fa-solid fa-pencil</v-icon>
        {{ t("form.edit") }}
      </v-btn>
    </div>

    <div class="bg-white rounded pa-5">
      <div class="d-flex align-center">
        <v-avatar size="100">
          <v-img :alt="t('posts.logoAlt')" lazy-src="/assets/profile-placeholder.png">
            <template v-slot:error>
              <v-img src="/assets/profile-placeholder.png" cover referrerpolicy="same-origin" />
            </template>
          </v-img>
        </v-avatar>

        <h1 class="ml-5">{{ currOrg.name }}</h1>
      </div>
    </div>

    <div v-if="currOrg.bio" class="bg-white rounded pa-5 mt-3">
      <code v-html="currOrg.bio" />
    </div>
  </template>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";

import type { User } from "@/types/user";

definePageMeta({ path: "/organizations/:slug" });

const { currOrg, setOrg } = useOrganizations();
const $router = useRouter();
const $route = useRoute();
const { data: user } = useAuth();
const { notifyError } = useNotify();
const { t } = useI18n();

const slug = $route.params.slug as string;

const {
  data: org,
  pending,
  error,
  execute,
} = useFetch<User>(`/api/v1/organizations/${slug}`, { lazy: true, immediate: false });

onBeforeMount(() => {
  if (slug !== currOrg.value?.slug) {
    setOrg(null);
  }

  execute();
});

const canEdit = computed(() => org.value?.slug === user.value?.slug);

watch(
  () => org.value,
  (org) => org && setOrg(org),
  { immediate: true },
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
      notifyError(t("errors.fetchOrg"));
      $router.push("/");
    }
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
</style>
