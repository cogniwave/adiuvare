<template>
  <v-card variant="outlined">
    <v-card-item>
      <img
        src="https://re-food.org/wp-content/uploads/2020/02/RE-FOOD-logo-02.png"
      />

      <v-card-text>
        <v-row>
          <v-col>
            <div class="text-h6 column">
              {{ post.title }}
              <span class="text-subtitle2 font-weight-normal">
                {{ post.created_by }}, {{ post.created_at }}
              </span>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            {{ post.description }}
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="q-mb-sm">
              <v-chip
                v-for="location in post.locations"
                :key="location"
                class="cursor-pointer"
                @click="onLocationClick"
              >
                {{ location }}
              </v-chip>
            </div>

            <qa-post-tag
              v-for="tag in post.tags"
              :key="tag"
              :tag="tag"
              @click="onTagClick"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import QaPostTag from "@/components/QaPostTag.vue";
import type { Post } from "@/types/post";

defineProps<{
  post: Post;
}>();

const onLocationClick = () => {};

const onTagClick = () => {};
</script>

<style scoped>
img {
  position: absolute;
  top: 0;
  bottom: 0;
  height: 90%;
  width: auto;
  opacity: 0.2;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
