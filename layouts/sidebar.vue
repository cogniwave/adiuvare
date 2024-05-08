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
            <v-list-item :title="$t('menu.home')" to="/" />
            <v-list-item :title="$t('menu.orgs')" to="/organizations" />
            <v-list-item
              v-if="!['/', '/organizations'].includes($route.path)"
              :title="$t('menu.posts')"
              :to="`/?author=${$route.params.slug}`"
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
