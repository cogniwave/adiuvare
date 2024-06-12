<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card v-bind="props" class="mx-auto" variant="elevated" tile color="grey-lighten-4">
      <v-img
        :aspect-ratio="16 / 9"
        :src="org.photo || '-'"
        cover
        lazy-src="/assets/profile-placeholder.png"
        referrerpolicy="same-origin"
      >
        <template v-slot:error>
          <v-icon size="100px">fa-solid fa-shop-slash</v-icon>
        </template>

        <v-expand-transition>
          <div
            v-if="true || isHovering"
            class="transition-fast-in-fast-out v-card--reveal position-absolute py-3 px-4 bg-primary"
          >
            <div class="d-flex align-center justify-space-between flex-column text-center">
              <span>
                {{ visibleText }}

                <small
                  v-if="org.bio && org.bio.length > 180 && !showFullText"
                  class="inline"
                  @click="showAllText"
                >
                  {{ $t("org.showAllBio") }}
                </small>
              </span>

              <v-btn flat class="text-secondary mt-3" :to="`/organizations/${org.slug}`">
                {{ $t("org.learnMore") }}
              </v-btn>
            </div>
          </div>
        </v-expand-transition>
      </v-img>

      <v-card-text class="pt-2">
        <h3 class="text-h4 font-weight-light text-primary">{{ org.name }}</h3>

        <div v-if="org.bio" class="font-weight-light text-subtitle my-2">
          <v-tooltip :text="org.bio">
            {{ shortenText(org.bio, 100) }}
          </v-tooltip>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { shortenText } from "#imports";

import type { User } from "@/types/user";

const props = defineProps({
  org: { type: Object as PropType<User>, required: true },
});

const { t } = useI18n();

const visibleText = ref("");
const showFullText = ref(false);

onBeforeMount(() => {
  if (props.org.bio) {
    visibleText.value = shortenText(props.org.bio, 180);
  } else {
    visibleText.value = t("org.noBio");
  }
});

const showAllText = () => {
  visibleText.value = props.org.bio as string;
  showFullText.value = true;
};
</script>

<style lang="scss" scoped>
.v-card--reveal {
  max-height: 200px;
  height: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-background));
  }

  > div {
    min-height: 100%;
  }

  span {
    font-size: 16px;
    line-height: 22px;
  }

  small {
    cursor: pointer;
  }
}

:deep(.v-img__error) {
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    opacity: 0.2;
  }
}
</style>
