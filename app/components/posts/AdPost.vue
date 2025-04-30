<template>
  <!-- click event just to give it the nice ripple and hover effect xD -->
  <v-card flat variant="text" class="post mb-3" rounded="xl">
    <v-card-item>
      <v-card-title class="d-flex align-start" :class="{ 'flex-column': mdAndDown }">
        <v-row no-gutters>
          <v-col cols="3" lg="2" xl="1">
            <v-avatar size="64">
              <v-img :alt="t('posts.logoAlt')" src="https://re-food.org/wp-content/uploads/2020/02/RE-FOOD-logo-02.pn"
                     lazy-src="/assets/images/profile-placeholder.png">
                <template #error>
                  {{ post.createdBy[0] }}
                </template>
              </v-img>
            </v-avatar>
          </v-col>

          <v-col cols="9" lg="4" xl="5">
            <div class="text-subtitle">
              <nuxt-link :to="`/organizations/${post.createdBy}`" @click.stop>
                {{ post.createdBy }}
              </nuxt-link>

              <span class="text-subtitle-2 d-block">
                <!-- otherwise vue will complain because $t only "accepts"
             date and number but passing a string also works  -->
                {{ d(post.createdAt) }}
              </span>
            </div>
          </v-col>

          <v-col cols="12" lg="6">
            <div class="d-flex flex-column" :class="lgAndUp ? 'ml-auto align-end' : 'mt-3'">
              <h3 class="mb-0">{{ post.title }}</h3>

              <div style="line-height: 10px">
                <ad-post-need v-for="need in post.needs" :key="need" :need="need" />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="mt-5">
        <v-row>
          <v-col>
            {{ desc }}

            <span v-if="descTooLong && !descVisible" class="expand-desc" @click="viewAllDesc">
              {{ t("posts.expandDesc") }}
            </span>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-chip v-for="location in visibleLocations" :key="location" label class="cursor-pointer mr-1" rounded="md"
                size="small" @click="onLocationClick">
          {{ location }}
        </v-chip>

        <v-menu v-if="leftoverLocations.length" open-on-hover>
          <template #activator="{ props }">
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
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="plain" size="x-small" class="ml-2" icon @click.stop.prevent>
              <v-icon size="large">mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list density="compact" class="py-2">
            <template v-if="post.createdBy === user">
              <!-- edit post -->
              <v-list-item class="pl-2 pr-2" prepend-icon="mdi-pencil-outline"
                           :title="t('posts.options.edit')" @click.stop.prevent="openPost()" />

              <!-- enable post -->
              <v-list-item v-if="post.state === 'active'" class="pl-2 pr-2" prepend-icon="mdi-check-all"
                           :title="t('posts.options.enable')"
                           @click="$emit('click:state', { enable: true, title: post.title, id: post.id })" />

              <!-- disable post -->
              <v-list-item v-else class="pl-2 pr-2" prepend-icon="mdi-cancel" :title="t('posts.options.disable')"
                           @click="$emit('click:state', { enable: false, title: post.title, id: post.id })" />

              <v-list-item class="pl-2 pr-2" prepend-icon="mdi-delete" :title="t('posts.options.delete')"
                           @click="$emit('click:delete', post)" />
            </template>

            <v-list-item v-else class="pl-2 pr-2" prepend-icon="mdi-bullhorn" :title="t('posts.options.report')"
                         @click="onReport" />
          </v-list>
        </v-menu>

        <!-- contacts -->
        <v-menu v-if="smAndUp" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="outlined" size="small" rounded="md" class="ml-auto ml-r btn-contact"
                   @click.stop.prevent>
              {{ t("posts.contacts.contact") }}
            </v-btn>
          </template>

          <ad-contacts-list v-if="post.contacts?.length" :contacts="post.contacts" />
        </v-menu>

        <v-btn variant="outlined" size="small" rounded="md" class="btn-contact" :to="`/posts/${post.slug}`">
          {{ t("posts.viewMore") }}
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
  import { usePosts } from "app/store/posts";
  import AdPostNeed from "app/components/posts/AdPostNeed.vue";
  import type { Post, PostDeletePayload, PostStateTogglePayload } from "shared/types/post";

  const MAX_DESC = 1300;

  const $emit = defineEmits<{
    (e: "click:state", payload: PostStateTogglePayload): void;
    (e: "click:delete" | "click:report", payload: PostDeletePayload): void;
  }>();

  const $props = defineProps({
    post: { type: Object as PropType<Post>, required: true },
    user: { type: String, required: true },
  });

  const $router = useRouter();
  const { t, d } = useI18n();
  const { setPost } = usePosts();
  const { smAndUp, mdAndUp, mdAndDown, lgAndUp } = useDisplay();

  const desc = ref($props.post.description);
  const descTooLong = ref(false);
  const descVisible = ref(false);

  const numVisibleLocations = computed(() => (mdAndUp.value ? 3 : 1));

  const visibleLocations = ref<string[]>($props.post.locations.slice(0, numVisibleLocations.value));
  const leftoverLocations = ref<string[]>($props.post.locations.slice(numVisibleLocations.value));

  onBeforeMount(() => {
    if ($props.post.description.length > MAX_DESC) {
      desc.value = shortenText($props.post.description, MAX_DESC);

      descTooLong.value = true;
    }
  });

  const viewAllDesc = () => {
    desc.value = $props.post.description;
    descVisible.value = true;
  };

  const onLocationClick = () => {};

  const onReport = () => $emit("click:report", $props.post);

  const openPost = () => {
    setPost($props.post);
    $router.push(`posts/${$props.post.slug}/edit`);
  };
</script>

<style scoped>
  

</style>
