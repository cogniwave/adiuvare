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
        <v-hover v-slot="{ isHovering, props }">
          <v-card class="mx-auto" variant="elevated" tile color="grey-lighten-4" v-bind="props">
            <v-img
              :aspect-ratio="16 / 9"
              :src="org.photo || '-'"
              cover
              referrerpolicy="same-origin"
            >
              <template v-slot:error>
                <v-img
                  src="https://picsum.photos/500/300?image=232"
                  cover
                  referrerpolicy="same-origin"
                />
              </template>

              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="transition-fast-in-fast-out v-card--reveal d-flex bg-primary align-end justify-center"
                  style="height: 100%"
                >
                  <span v-if="org.bio"> {{ org.bio }}</span>

                  <v-btn flat class="text-secondary mb-3" :to="`/organizations/${org.slug}`">
                    {{ $t("org.learnMore") }}
                  </v-btn>
                </div>
              </v-expand-transition>
            </v-img>

            <v-card-text class="pt-2">
              <h3 class="text-h4 font-weight-light text-primary">{{ org.name }}</h3>

              <div v-if="org.bio" class="font-weight-light text-subtitle my-2">
                <v-tooltip :text="org.bio">
                  {{ shortenText(org.bio, 100) }}
                </v-tooltip>
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </template>
</template>

<script lang="ts" setup>
import type { GetOrganizationsResult } from "@/types/user";

definePageMeta({ path: "/organizations" });

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
