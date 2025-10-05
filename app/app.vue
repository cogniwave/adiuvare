<template>
  <v-app>
    <app-loading v-if="isLoading" />

    <app-navbar />

    <app-mobile-menu v-if="smAndDown" />

    <!-- todo: add when there's messages and stuffs -->
    <!-- <app-notifications /> -->

    <app-snackbar />

    <NuxtLayout />

    <app-footer />
  </v-app>
</template>

<script lang="ts" setup>
  import AppLoading from "app/components/common/AppLoading.vue";
  import AppNavbar from "app/components/layout/AppNavbar.vue";
  import AppMobileMenu from "app/components/layout/AppMobileMenu.vue";
  import AppSnackbar from "app/components/common/AppSnackbar.vue";
  import AppFooter from "app/components/layout/AppFooter.vue";

  const { t } = useI18n();
  const { smAndDown } = useDisplay();
  const config = useRuntimeConfig();

  useHead({
    titleTemplate: (page) => (page ? `${t(page)} | Adiuvare` : "Adiuvare"),
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

      window.BrevoConversationsSetup = { deferredLoading: true };
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
