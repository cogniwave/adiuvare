<template>
  <v-card flat variant="text" class="post" rounded="xl">
    <v-card-item>
      <v-card-title class="d-flex align-start">
        <v-avatar size="64">
          <v-img
            :alt="$t('posts.logoAlt')"
            src="https://re-food.org/wp-content/uploads/2020/02/RE-FOOD-logo-02.pn"
            lazy-src="../assets/post-profile-placeholder.png"
          >
            <template v-slot:error>
              {{ post.createdBy[0] }}
            </template>
          </v-img>
        </v-avatar>

        <div class="text-subtitle ml-3">
          <nuxt-link :to="`profile/${post.createdBySlug || 'cposas'}`">
            {{ post.createdBy }}
          </nuxt-link>

          <span class="text-subtitle-2 d-block">
            {{ $d(post.createdAt) }}
          </span>
        </div>

        <div class="ml-auto d-flex align-end flex-column">
          <h3 class="mb-0">{{ post.title }}</h3>

          <div style="line-height: 10px">
            <qa-post-need
              v-for="need in post.needs"
              :key="need"
              :need="need"
              rounded="md"
              label
              size="x-small"
              variant="text"
              class="cursor-pointer ml-1 pr-1"
            />
          </div>
        </div>
      </v-card-title>

      <v-card-text class="mt-5">
        <v-row>
          <v-col>
            {{ desc }}

            <span
              v-if="descTooLong && !descVisible"
              class="expand-desc"
              @click="viewAllDesc"
            >
              {{ $t("posts.expandDesc") }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-chip
          v-for="location in visibleLocations"
          :key="location"
          label
          class="cursor-pointer mr-1"
          rounded="md"
          size="small"
          @click="onLocationClick"
        >
          {{ location }}
        </v-chip>

        <v-menu v-if="leftoverLocations.length" open-on-hover>
          <template v-slot:activator="{ props }">
            <span v-bind="props">
              <v-chip label size="small">
                +{{ leftoverLocations.length }}
              </v-chip>
            </span>
          </template>

          <v-list density="compact" class="pt-1 pb-2">
            <v-list-item
              v-for="location in leftoverLocations"
              :key="location"
              class="pl-2 pr-2"
            >
              <v-chip
                label
                variant="text"
                class="cursor-pointer mr-1"
                rounded="md"
                size="small"
              >
                {{ location }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn variant="outlined" size="small" rounded="md" class="ml-auto">
          {{ $t("posts.contact") }}
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import QaPostNeed from "@/components/QaPostNeed.vue";

import type { Post } from "@/types/post";

const MAX_DESC = 1300;
const NUM_VISIBLE_LOCATIONS = 3;

const props = defineProps({
  post: { type: Object as PropType<Post>, required: true },
});

const desc = ref(props.post.description);
const descTooLong = ref(false);
const descVisible = ref(false);
const visibleLocations = ref<string[]>([]);
const leftoverLocations = ref<string[]>([]);

onBeforeMount(() => {
  if (props.post.description.length > MAX_DESC) {
    desc.value = `${props.post.description
      .substring(0, MAX_DESC - 10)
      .trim()}...`;

    descTooLong.value = true;
  }

  visibleLocations.value = props.post.locations.slice(0, NUM_VISIBLE_LOCATIONS);

  if (props.post.locations.length > NUM_VISIBLE_LOCATIONS) {
    leftoverLocations.value = props.post.locations.slice(NUM_VISIBLE_LOCATIONS);
  }
});

const viewAllDesc = () => {
  desc.value = props.post.description;
  descVisible.value = true;
};

const onLocationClick = () => {};
</script>

<style scoped lang="scss">
.post {
  background-color: rgb(var(--v-theme-surface));

  :deep(.v-img__error) {
    color: rgb(var(--v-theme-primary));
    background-color: rgb(var(--v-theme-background));
    font-size: 2rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .v-card-title {
    a {
      text-decoration: none;
      color: rgb(var(--v-theme-accent));
    }
  }

  .v-card-item {
    color: rgb(var(--v-theme-accent));

    h3 {
      font-weight: normal;
      text-transform: uppercase;
    }

    .v-card-actions {
      button {
        color: rgb(var(--v-theme-primary));
        background-color: rgb(var(--v-theme-background));
      }
    }
  }

  .expand-desc {
    cursor: pointer;
    color: rgb(var(--v-theme-primary));
    font-weight: bold;
  }
}
</style>
