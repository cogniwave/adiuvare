<template>
  <v-row class="mt-10">
    <v-col offset="2" cols="8">
      <v-btn @click="store.openDialog">criar</v-btn>

      <qa-filter />

      <v-virtual-scroll item-height="264" :items="store.posts">
        <template v-slot:default="{ item }">
          <qa-post :post="item" />
        </template>
      </v-virtual-scroll>

      <v-pagination v-model="page" length="5" />

      <qa-post-dialog v-if="store.dialogRendered" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import QaFilter from "@/components/QaFilter.vue";
import QaPost from "@/components/QaPost.vue";
// import QaPostDialog from "@/components/QaPostDialog.vue";
import { usePostsStore } from "@/stores/posts";

definePageMeta({ path: "/" });

const page = ref(0);
const store = usePostsStore();

onBeforeMount(() => useAsyncData("posts", () => store.getPosts()));
</script>

<style scoped>
/* .q-page {
  width: 60vw;
  display: block;
  margin: auto; */
/* } */
</style>
