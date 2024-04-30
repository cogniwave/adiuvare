<template>
  <template v-if="loading">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render posts -->
  <template v-else-if="posts.length">
    <v-avatar size="64">
      <v-img :alt="$t('posts.logoAlt')" lazy-src="/assets/post-profile-placeholder.png">
        <template v-slot:error>
          {{ currPost.createdBy[0] }}
        </template>
      </v-img>
    </v-avatar>
  </template>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";

import { useNotifyStore } from "@/stores/notify.store";
import type { Post } from "@/types/post";

definePageMeta({ layout: "sidebar", path: "/posts/:slug" });

const { currPost, posts } = usePosts<Post>();
const $router = useRouter();
const $route = useRoute();
const $notify = useNotifyStore();
const { data } = useAuth();

const canEdit = ref(false);
const loading = ref(false);

onBeforeMount(async () => {
  loading.value = true;

  const slug = $route.params.slug as string;
  if (slug === data.value?.slug) {
    canEdit.value = true;
  }

  try {
    currPost.value = await $fetch<Post>(`/api/v1/posts/${slug}`, { method: "get" });
  } catch (err: any) {
    if (err.status === 404) {
      $router.push("/not-found");
    } else {
      $notify.notifyError("Could not fetch post");
      $router.back();
    }
  }
});
</script>
