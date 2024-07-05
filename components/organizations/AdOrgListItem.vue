<template>
  <v-card class="mx-auto" variant="elevated" tile color="grey-lighten-4">
    <nuxt-link :to="`/organizations/${org.slug}`">
      <v-hover v-slot="{ isHovering, props }">
        <v-img
          v-bind="props"
          :aspect-ratio="16 / 9"
          :src="org.photo || '-'"
          cover
          lazy-src="/assets/images/profile-placeholder.png"
          referrerpolicy="same-origin"
        >
          <template v-slot:error>
            <v-icon size="100px">fa-solid fa-shop-slash</v-icon>
          </template>

          <v-expand-transition>
            <div
              v-if="isHovering"
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
      </v-hover>

      <v-card-text class="pt-2">
        <h3 class="text-h6 ma-0 text-center font-weight-light text-primary">{{ org.name }}</h3>
      </v-card-text>
    </nuxt-link>
  </v-card>
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
  height: 100%;
  width: 100%;
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

.text-subtitle {
  color: #000;
}
</style>
