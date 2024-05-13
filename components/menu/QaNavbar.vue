<template>
  <v-app-bar color="white" density="compact" elevation="0">
    <template v-slot:title>
      <v-row no-gutters>
        <v-col cols="1">
          <ClientOnly fallback-tag="img">
            <v-img
              src="/assets/logo.png"
              aspect-ratio="1"
              width="48px"
              eager
              @click="$router.push('/')"
            />
          </ClientOnly>
        </v-col>

        <ClientOnly fallback-tag="div">
          <v-col cols="3" offset="2" align-self="center">
            <form @submit.prevent="search">
              <v-text-field
                v-model:model-value="query"
                variant="solo"
                flat
                clearable
                append-inner-icon="fa-solid fa-magnifying-glass"
                rounded="lx"
                density="compact"
                hide-details
                :placeholder="$t('filter.placeholder')"
                @click:append-inner="search"
              />
            </form>
          </v-col>
        </ClientOnly>

        <ClientOnly fallback-tag="div">
          <v-col cols="3" align-self="center" align="end">
            <v-btn
              v-if="loggedIn && isOrg"
              size="small"
              rounded="md"
              variant="plain"
              class="ml-auto btn-contact"
              to="/posts/new"
            >
              {{ $t("posts.submit") }}
            </v-btn>
          </v-col>
        </ClientOnly>

        <v-col cols="3" align-self="center" align="end">
          <ClientOnly fallback-tag="span" :fallback="$t('loading')">
            <!-- todo: readd when we actually have notifications -->
            <!-- <v-btn
              v-if="authed"
              class="text-none"
              stacked
              size="x-small"
              @click="$notifStore.toggleNotifications"
            >
              <v-badge
                v-if="$notifStore.notifications.length"
                :content="$notifStore.badge"
                label="notifications"
              >
                <v-icon size="x-small"> fa-solid fa-bell </v-icon>
              </v-badge>

              <v-icon v-else size="x-small"> fa-solid fa-bell </v-icon>
            </v-btn> -->

            <qa-profile-menu />
          </ClientOnly>
        </v-col>
      </v-row>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
// import { useNotificationsStore } from "@/stores/notifications.store";

const { loggedIn, data } = useAuth();

// const $notifStore = useNotificationsStore();
const query = ref("");

const isOrg = computed(() => data.value?.type === "org");

const search = () => console.log("searching");
</script>
