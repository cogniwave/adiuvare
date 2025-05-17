<template>
  <div v-if="loading" class="d-flex w-100 flex-wrap justify-space-between">
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
    <v-skeleton-loader type="card" class="rounded-xl mt-5 mr-5" width="45%" />
  </div>

  <template v-else>
    <section class="mb-5 d-flex align-center justify-space-between w-100">
      <div class="d-flex align-center">
        <h2 class="text-h6 text-subtext mr-3">{{ $t("orgs.title") }}</h2>

        <!-- uncomment with #21  -->
        <!-- <v-btn to="/organizations/create" color="secondary" variant="outlined" prepend-icon="fa-building">
          {{ $t("orgs.create") }}
        </v-btn> -->
      </div>

      <!-- add with #22 -->
      <!-- <form @keypress.enter.prevent="onSearch()">
        <v-text-field
          v-model:model-value="search"
          append-inner-icon="fa-magnifying-glass"
          class="search-field"
          variant="solo"
          color="accent"
          width="500px"
          rounded="lx"
          density="compact"
          hide-details
          persistent-clear
          :clearable="!!filter"
          :placeholder="t('filter.placeholder')"
          @click:clear="resetSearch()"
          @click:append-inner.stop.prevent="onSearch()"
        >
          <template #append>
            <v-btn icon flat variant="text" @click="toggleExpandedFilter">
              <v-icon color="accent">fa-filter</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </form> -->
    </section>

    <!-- add with #22 -->
    <!-- <v-expand-transition v-if="detailedSearchRendered">
      <div v-show="expandedFilterVisible" class="mb-4">
        <form class="mt-5 mb-3 w-100" @keypress.enter.prevent="onSearch(true)" @submit.prevent="onSearch(true)">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model:model-value="title"
                prepend-icon="fa-heading"
                density="compact"
                flat
                hide-details
                persistent-clear
                label="Pesquisar por titulo"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-textarea
                v-model:model-value="description"
                rows="1"
                prepend-icon="fa-quote-left"
                rounded="lx"
                density="compact"
                hide-details
                persistent-clear
                label="Pesquisar na descrição"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model:model-value="need"
                hide-hint
                multiple
                prepend-icon="fa-parachute-box"
                :label="t('form.post.category')"
                :items="needs"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model:model-value="location"
                rounded="lx"
                density="compact"
                prepend-icon="fa-map-location"
                chips
                class="detailed-filter"
                hide-details
                multiple
                label="Pesquisar por localidade"
                no-filter
                closable-chips
                :auto-select-first="false"
                :no-data-text="noDataText"
                :items="locations"
                :loading="filteringLocations"
                @update:search="filterLocations"
              />
            </v-col>
          </v-row>

          <div class="pt-5 d-flex align-center justify-end">
            <v-btn class="btn-reset" type="button" :loading="loading" @click="resetSearch">
              {{ t("feed.emptySearchReset") }}
            </v-btn>

            <v-btn class="filter-actions" type="submit" :loading="loading">
              {{ t("feed.filter") }}
            </v-btn>
          </div>
        </form>

        <v-divider />
      </div>
    </v-expand-transition> -->

    <section>
      <ad-org-list-item v-for="org in orgs" :key="org.slug" :org="org" />
    </section>
  </template>
</template>

<script lang="ts" setup>
  import { useNotify } from "app/store/notify";
  import AdOrgListItem from "app/components/organizations/AdOrgListItem.vue";
  import { useOrganizations } from "app/store/organizations";
  import type { GetOrganizationsResult } from "shared/types/user";

  useSeoMeta({ title: "pages.orgList" });
  definePageMeta({ path: "/organizations", layout: "full-width" });

  const { orgs, setOrgs } = useOrganizations();
  const { notifyError } = useNotify();
  const { t } = useI18n();
  // add with #22
  // const $route = useRoute();
  // const { filterLocations, filteringLocations, locations, noDataText } = useLocations();
  // const $router = useRouter();

  // const search = ref<string | undefined>();
  // const expandedFilterVisible = ref(false);
  // const detailedSearchRendered = ref(false);

  // const title = ref<string | undefined>();
  // const description = ref<string | undefined>();
  // const location = ref<string[] | undefined>();
  // const need = ref<string[] | undefined>();

  // const page = ref(setupPage());
  // const filter = ref<PostFilter | undefined>(setupQuery());
  const { status, error } = await useFetch<GetOrganizationsResult>("/api/v1/organizations", {
    lazy: true,
    onResponse: ({ response }) => setOrgs(response._data || []),
  });

  const loading = computed(() => status.value === "pending");

  // const needs: SelectOption[] = [
  //   { title: t("posts.needs.money"), value: "money" },
  //   { title: t("posts.needs.volunteers"), value: "volunteers" },
  //   { title: t("posts.needs.goods"), value: "goods" },
  //   { title: t("posts.needs.other"), value: "other" },
  // ];

  // const onSearch = (detailed = false) => {
  //   if (detailed) {
  //     if (!title.value && !description.value && !location.value?.length && !need.value?.length) {
  //       return;
  //     }

  //     filter.value = {
  //       title: title.value,
  //       description: description.value,
  //       locations: location.value?.length ? location.value : undefined,
  //       needs: need.value?.length ? need.value : undefined,
  //     };
  //   } else {
  //     if (!search.value) {
  //       return;
  //     }

  //     if (search.value === filter.value) {
  //       return;
  //     }

  //     filter.value = { query: search.value };
  //   }

  //   page.value = 1;

  //   $router.push({ path: "/", query: { page: 1, ...filter.value } });
  //   refresh();
  // };

  // const toggleExpandedFilter = () => {
  //   if (!detailedSearchRendered.value) {
  //     detailedSearchRendered.value = true;
  //     nextTick(() => (expandedFilterVisible.value = true));
  //   } else {
  //     expandedFilterVisible.value = !expandedFilterVisible.value;
  //   }
  // };

  // const resetSearch = () => {
  //   page.value = 1;
  //   filter.value = undefined;
  //   search.value = undefined;
  //   title.value = undefined;
  //   description.value = undefined;
  //   location.value = undefined;
  //   need.value = undefined;

  //   $router.push({ path: "/", query: {} });
  // };

  // add with #22
  // function setupPage() {
  //   const page = $route.query?.page;

  //   if (!page) {
  //     return 1;
  //   }

  //   const p = Number(page);

  //   return !isNaN(p) && p > 1 ? p : 1;
  // }

  // function setupQuery() {
  //   const query = $route.query;

  //   if (!query) {
  //     return undefined;
  //   }

  //   const f: PostFilter = {};

  //   if (!query.query) {
  //     if (query.title) {
  //       title.value = query.title as string;
  //       f.title = title.value;
  //     }

  //     if (query.description) {
  //       description.value = query.description as string;
  //       f.description = description.value;
  //     }

  //     if (query.needs) {
  //       need.value = query.needs as string[];
  //       f.needs = need.value;
  //     }

  //     if (query.locations) {
  //       location.value = query.locations as string[];
  //       f.locations = location.value;
  //     }
  //   } else {
  //     search.value = query.query as string;
  //     f.query = search.value;
  //   }

  //   if (Object.keys(f).length) {
  //     filter.value = f;
  //   }
  // }

  // add with #22
  // watch(page, (pg) => {
  //   $router.push({ path: "/", query: { ...($router.currentRoute.value.query || {}), page: pg } });
  // });

  watch(
    () => error.value,
    (err) => err && notifyError(t("errors.fetchOrgs")),
    { immediate: true },
  );
</script>

<style lang="scss" scoped>
  section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }

  .search-field :deep(.v-field__append-inner .v-icon) {
    color: rgba(var(--v-theme-accent));
  }
</style>
