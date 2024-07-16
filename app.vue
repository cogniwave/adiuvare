<template>
  <v-app>
    <ad-loading :loading="initLoading || isLoading" />

    <ad-navbar />

    <ad-mobile-menu v-if="smAndDown" />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <ad-notifications /> -->

    <ad-snackbar />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ad-footer v-if="$route.meta.middleware !== 'unauthed'" />
  </v-app>
</template>

<script lang="ts" setup>
import { useRoute } from "#imports";
import { useDisplay } from "vuetify";

const { t } = useI18n();
const $route = useRoute();
const { smAndDown } = useDisplay();
const config = useRuntimeConfig();

useHead({
  titleTemplate: () => {
    return $route.meta.title ? `Adiuvare - ${t($route.meta.title as string)}` : "Adiuvare";
  },
});

const { isLoading, start, finish } = useLoadingIndicator();

// show the loading screen on first render as loadingIndicator doesnt seem to be doing its job
const initLoading = ref(true);

onBeforeMount(() => start());

onMounted(() => {
  initLoading.value = false;
  finish();

  if (!import.meta.dev) {
    // no use in trying to add stuff to doc if doc does not exist
    if (!document.head) {
      return;
    }

    window.BrevoConversationsID = config.public.brevoConversationId;

    window.BrevoConversations =
      window.BrevoConversations ||
      function () {
        (window.BrevoConversations.q = window.BrevoConversations.q || []).push(arguments);
      };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://conversations-widget.brevo.com/brevo-conversations.js";

    document.head.appendChild(script);
  }
});
</script>
