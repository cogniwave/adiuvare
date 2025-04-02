<template>
  <v-app>
    <ad-loading v-if="isLoading" />

    <ad-navbar />

    <ad-mobile-menu v-if="smAndDown" />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <ad-notifications /> -->

    <ad-snackbar />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ad-footer />
  </v-app>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const $route = useRoute();
  const { smAndDown } = useDisplay();
  const config = useRuntimeConfig();

  useHead({
    titleTemplate: () => {
      return $route.meta.title ? `${t($route.meta.title as string)} | Adiuvare` : "Adiuvare";
    },
  });

  const { isLoading, start, finish } = useLoadingIndicator();

  start();

  onMounted(() => {
    finish();

    if (!import.meta.dev) {
      // no use in trying to add stuff to doc if doc does not exist
      if (!document.head) {
        return;
      }

      window.BrevoConversationsSetup = {
        deferredLoading: true,
      };

      window.BrevoConversationsID = config.public.brevoConversationId;

      window.BrevoConversations =
        window.BrevoConversations ||
        function (...args: unknown[]) {
          (window.BrevoConversations.q = window.BrevoConversations.q || []).push(args);
        };

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://conversations-widget.brevo.com/brevo-conversations.js";

      document.head.appendChild(script);
    }
  });
</script>
