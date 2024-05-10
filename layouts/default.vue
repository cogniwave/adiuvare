<template>
  <v-layout>
    <qa-navbar />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <qa-notifications /> -->

    <qa-snackbar />

    <v-main>
      <v-row no-gutters class="py-10">
        <v-col cols="2">
          <v-list>
            <v-list-item :title="$t('menu.home')" to="/" prepend-icon="fa-solid fa-house" />
            <v-list-item
              :title="$t('menu.orgs')"
              to="/organizations"
              prepend-icon="fa-solid fa-building-ngo"
            />
            <v-list-item
              v-if="!['/', '/organizations'].includes($route.path)"
              prepend-icon="fa-solid fa-file-lines"
              :title="$t('menu.posts')"
              :to="{ path: '/', query: { createdBy: $route.params.slug } }"
            />
          </v-list>
        </v-col>

        <v-col offset="1" cols="6">
          <slot />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>

<style scoped>
.v-list {
  background: transparent;
}
</style>
