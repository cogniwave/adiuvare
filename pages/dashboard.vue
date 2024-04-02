<template>
  <v-row no-gutters class="mt-10">
    <v-col offset="3" cols="6">
      <!-- <v-btn @click="store.openDialog">criar</v-btn>

      <qa-filter /> -->

      <p class="mb-5">Recent posts</p>

      <v-virtual-scroll item-height="264" :items="store.posts">
        <template v-slot:default="{ item }">
          <qa-post :post="item" class="mb-5" />
        </template>
      </v-virtual-scroll>

      <v-pagination v-model="page" length="5" />

      <qa-post-dialog v-if="store.dialogRendered" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// https://cdn.dribbble.com/userupload/8357595/file/original-ad4a908cafbe0bc3bdfa401033e1ba1d.png?resize=752x
// https://cdn.dribbble.com/userupload/4391981/file/original-1f2087f908f96ad48f1da1e014bc186a.mp4
// https://cdn.dribbble.com/userupload/10640865/file/original-3fa71060d497c906c597896bae938aa5.png?resize=752x
import { onBeforeMount, ref } from "vue";

import QaFilter from "@/components/QaFilter.vue";
import QaPost from "@/components/QaPost.vue";
// import QaPostDialog from "@/components/QaPostDialog.vue";
import { usePostsStore } from "@/stores/posts.store";

definePageMeta({
  path: "/",
  auth: { unauthenticatedOnly: false },
});

const page = ref(0);
const store = usePostsStore();

onBeforeMount(() => useAsyncData("posts", () => store.getPosts()));
</script>
