<template>
  <div v-if="pending" class="d-flex w-100 flex-wrap justify-space-between">
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
  </div>

  <template v-else-if="orgs.length">
    <v-row>
      <v-col v-for="org in orgs" :key="org.slug" md="6" lg="4" xl="3" cols="12">
        <ad-org-list-item :org="org" />
      </v-col>
    </v-row>
  </template>
</template>

<script lang="ts" setup>
  import { useNotify } from "@/store/notify";
  import { useOrganizations } from "@/store/organizations";
  import type { GetOrganizationsResult } from "~~/shared/types/user";

  definePageMeta({ path: "/organizations", title: "pages.orgList", layout: "listing" });

  const { orgs, setOrgs } = useOrganizations();
  const { notifyError } = useNotify();
  const { t } = useI18n();

  const { pending, error } = await useFetch<GetOrganizationsResult>("/api/v1/organizations", {
    lazy: true,
    onResponse({ response }) {
      setOrgs(response._data || []);
    },
  });

  watch(
    () => error.value,
    (err) => {
      if (err) {
        notifyError(t("errors.fetchOrgs"));
      }
    },
    { immediate: true },
  );
</script>
