<template>
  <v-card
    color="surface"
    :to="`/organizations/${org.slug}`"
    :prepend-icon="!org.photo ? 'fa-solid fa-shop-slash' : undefined"
    :prepend-avatar="org.photo"
    :title="org.name"
    subtitle="<org type>"
  >
    <template #title>
      <v-card-title class="text-heading font-weight-bold">
        {{ org.name }}
      </v-card-title>
    </template>

    <v-card-text class="text-regular">
      <template v-if="org.about">
        {{ visibleText }}

        <small v-if="org.about.length > 180 && !showFullText" class="inline" @click.stop.prevent="showAllText">
          {{ $t("org.showAllBio") }}
        </small>
      </template>

      <span v-else class="font-italic"> {{ $t("org.noBio") }}</span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { shortenText } from "app/utils";
  import type { Organization } from "shared/types/organization";

  const $props = defineProps({
    org: { type: Object as PropType<Organization>, required: true },
  });

  const visibleText = ref("");
  const showFullText = ref(false);

  onBeforeMount(() => {
    if ($props.org.about) {
      visibleText.value = shortenText($props.org.about, 180);
    }
  });

  const showAllText = () => {
    visibleText.value = $props.org.about as string;
    showFullText.value = true;
  };
</script>

<style lang="scss" scoped>
  .v-card {
    max-width: 300px;
  }
</style>
