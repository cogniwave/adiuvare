<template>
  <v-main>
    <v-container>
      <v-row no-gutters :class="lgAndUp ? 'mt-10 py-5' : 'py-5'">
        <v-col md="10" offset-md="1" lg="6" offset-lg="3" offset="12" cols="0">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
  const { lgAndUp } = useDisplay();
</script>
