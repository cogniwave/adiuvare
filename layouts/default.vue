<template>
  <v-main>
    <v-row no-gutters class="py-10">
      <v-col v-if="lgAndUp" cols="2">
        <v-list bg-color="transparent">
          <template v-if="showCreateButton">
            <v-list-item
              :title="t('posts.submit')"
              to="/posts/new"
              prepend-icon="fa-solid fa-house"
            />

            <v-divider class="my-3" />
          </template>

          <v-list-item :title="t('menu.home')" to="/" prepend-icon="fa-solid fa-house" />

          <v-list-item
            :title="t('menu.orgs')"
            to="/organizations"
            prepend-icon="fa-solid fa-building-ngo"
          />

          <!-- <v-list-item
            v-if="showUserPosts"
            prepend-icon="fa-solid fa-file-lines"
            :title="t('menu.posts')"
            :to="{ path: '/', query: { createdBy: $route.params.slug } }"
          /> -->
        </v-list>
      </v-col>

      <v-col
        offset-lg="1"
        lg="6"
        offset-md="2"
        md="8"
        offset-sm="1"
        sm="10"
        offset="0"
        cols="12"
        :class="{ 'px-2': xs }"
      >
        <slot />
      </v-col>
    </v-row>
  </v-main>

  <speed-insights />
</template>

<script setup lang="ts">
// import { useRoute } from "#imports";
import { useDisplay } from "vuetify";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

import { useAuth } from "@/store/auth";

// const { data } = useAuth();
// const $route = useRoute();
const { t } = useI18n();
const { lgAndUp, xs } = useDisplay();
const { loggedIn, data } = useAuth();

const showCreateButton = computed(() => loggedIn && data.value?.type === "org");

// TODO: implement this at a later date
// const showUserPosts = computed(() => {
//   // todo: implement this at a later stage
//   // if no meta exists its because its error page
//   if (["/", "/organizations"].includes($route.path) || !Object.keys($route.meta).length) {
//     return false;
//   }

//   if ($route.path === "/profile") {
//     return data.value?.type === "org";
//   }

//   return true;
// });
</script>
