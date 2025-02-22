<template>
  <v-main>
    <v-row no-gutters class="py-10">
      <v-col v-if="lgAndUp" cols="2">
        <ad-menu />
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
</template>

<script setup lang="ts">
  const { lgAndUp, xs } = useDisplay();

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
