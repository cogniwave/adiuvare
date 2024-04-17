<template>
  <v-layout>
    <qa-navbar />

    <qa-snackbar />

    <v-main>
      <v-row no-gutters class="py-10">
        <v-col offset="3" cols="6">
          <slot />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>
