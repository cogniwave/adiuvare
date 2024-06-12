<template>
  <div v-if="pending" class="d-flex w-100 flex-wrap justify-space-between">
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
  </div>

  <template v-if="orgs.length">
    <v-row>
      <v-col v-for="org in orgs" :key="org.slug" cols="5">
        <ad-org-list-item :org="org" />
      </v-col>
    </v-row>
  </template>
</template>

<script lang="ts" setup>
import { useNotify } from "@/store/notify";
import { useOrganizations } from "@/store/organizations";
import type { GetOrganizationsResult } from "@/types/user";

definePageMeta({ path: "/organizations", title: "pages.orgList" });

const { orgs, setOrgs } = useOrganizations();
const { notifyError } = useNotify();

const { data, pending, error, execute } = useFetch<GetOrganizationsResult>(
  "/api/v1/organizations",
  { lazy: true, immediate: false },
);

onBeforeMount(execute);

watch(
  () => data.value,
  (data) => data && setOrgs(data),
  { immediate: true },
);

watch(
  () => error.value,
  (err) => {
    if (err) {
      notifyError("Could not fetch organizations");
    }
  },
  { immediate: true },
);
</script>
