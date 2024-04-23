<template>
  <nuxt-link :to="`posts/${post.slug}`">
    <!-- click event just to give it the nice ripple and hover effect xD -->
    <v-card flat variant="text" class="post" rounded="xl" @click="() => {}">
      <v-card-item>
        <v-card-title class="d-flex align-start">
          <v-avatar size="64">
            <v-img
              :alt="$t('posts.logoAlt')"
              src="https://re-food.org/wp-content/uploads/2020/02/RE-FOOD-logo-02.pn"
              lazy-src="/assets/post-profile-placeholder.png"
            >
              <template v-slot:error>
                {{ post.createdBy[0] }}
              </template>
            </v-img>
          </v-avatar>

          <div class="text-subtitle ml-3">
            <nuxt-link :to="`profile/${post.createdBySlug || 'cposas'}`" @click.stop>
              {{ post.createdBy }}
            </nuxt-link>

            <span class="text-subtitle-2 d-block">
              {{ $d(post.createdAt) }}
            </span>
          </div>

          <div class="ml-auto d-flex align-end flex-column">
            <h3 class="mb-0">{{ post.title }}</h3>

            <div style="line-height: 10px">
              <qa-post-need v-for="need in post.needs" :key="need" :need="need" />
            </div>
          </div>
        </v-card-title>

        <v-card-text class="mt-5">
          <v-row>
            <v-col>
              {{ desc }}

              <span v-if="descTooLong && !descVisible" class="expand-desc" @click="viewAllDesc">
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
                <v-chip label size="small"> +{{ leftoverLocations.length }} </v-chip>
              </span>
            </template>

            <v-list density="compact" class="pt-1 pb-2">
              <v-list-item v-for="location in leftoverLocations" :key="location" class="pl-2 pr-2">
                <v-chip label variant="text" class="cursor-pointer mr-1" rounded="md" size="small">
                  {{ location }}
                </v-chip>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer />

          <!-- post options -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="plain"
                size="x-small"
                class="mr-2"
                icon
                @click.stop.prevent
              >
                <v-icon size="x-small">fa-solid fa-ellipsis-vertical</v-icon>
              </v-btn>
            </template>

            <v-list density="compact" class="py-2">
              <template v-if="post.createdBySlug !== user">
                <!-- edit post -->
                <v-list-item
                  class="pl-2 pr-2"
                  prepend-icon="fa-solid fa-pencil"
                  :title="$t('posts.options.edit')"
                  @click.stop.prevent="openPost()"
                />

                <!-- enable post -->
                <v-list-item
                  v-if="post.state === 'hidden'"
                  class="pl-2 pr-2"
                  prepend-icon="fa-solid fa-check-double"
                  :title="$t('posts.options.enable')"
                  @click="$emit('click:state', { enable: true, title: post.title, id: post.id })"
                />

                <!-- disable post -->
                <v-list-item
                  v-else
                  class="pl-2 pr-2"
                  prepend-icon="fa-solid fa-ban"
                  :title="$t('posts.options.disable')"
                  @click="$emit('click:state', { enable: false, title: post.title, id: post.id })"
                />

                <v-list-item
                  class="pl-2 pr-2"
                  prepend-icon="fa-solid fa-trash"
                  :title="$t('posts.options.delete')"
                  @click="$emit('click:delete', post)"
                />
              </template>

              <v-list-item
                v-else
                class="pl-2 pr-2"
                prepend-icon="fa-solid fa-bullhorn"
                :title="$t('posts.options.report')"
                @click="onReport"
              />
            </v-list>
          </v-menu>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="outlined"
                size="small"
                rounded="md"
                class="ml-auto btn-contact"
                @click.stop.prevent
              >
                {{ $t("posts.contact") }}
              </v-btn>
            </template>

            <v-list density="compact">
              <template v-for="(c, idx) in post.contacts" :key="idx">
                <v-list-item v-if="c.type === 'email'" icon="fa-solid fa-phone">
                  <a :href="`tel:${c.contact}`">{{ c.contact }}</a>
                </v-list-item>

                <v-list-item v-else-if="c.type === 'phone'" icon="fa-solid fa-phone">
                  <a :href="`tel:${c.contact}`">{{ c.contact }}</a>
                </v-list-item>

                <v-list-item
                  v-else
                  :key="c.contact"
                  icon="fa-solid fa-file-signature"
                  :title="c.contact"
                >
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card-item>
    </v-card>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { Post, PostDeletePayload, PostStateTogglePayload } from "@/types/post";

import QaPostNeed from "@/components/posts/QaPostNeed.vue";
import { usePostsStore } from "@/stores/posts.store";
import { useReportStore } from "@/stores/report.store";

const MAX_DESC = 1300;
const NUM_VISIBLE_LOCATIONS = 3;

const $emit = defineEmits<{
  (e: "click:state", payload: PostStateTogglePayload): void;
  (e: "click:delete", payload: PostDeletePayload): void;
}>();

const props = defineProps({
  post: { type: Object as PropType<Post>, required: true },
  user: { type: String, required: true },
});

const $router = useRouter();
const $reportStore = useReportStore();
const $postsStore = usePostsStore();

const desc = ref(props.post.description);
const descTooLong = ref(false);
const descVisible = ref(false);
const visibleLocations = ref<string[]>([]);
const leftoverLocations = ref<string[]>([]);

onBeforeMount(() => {
  if (props.post.description.length > MAX_DESC) {
    desc.value = shortenText(props.post.description, MAX_DESC);

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

const onReport = () => $reportStore.openDialog(props.post);

const openPost = () => {
  $postsStore.setPost(props.post);
  $router.push(`posts/${props.post.slug}/edit`);
};
</script>

<style scoped lang="scss">
.post {
  background-color: rgb(var(--v-theme-surface));

  // &:hover {
  //   background-color: rgba(var(--v-theme-accent), 0.01);
  // }

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
      .btn-contact {
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
