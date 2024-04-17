<template>
  <v-layout>
    <qa-navbar />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <qa-notifications /> -->

    <qa-snackbar />

    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>
