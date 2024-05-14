<template>
  <template v-if="true">
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
    <v-skeleton-loader type="avatar, article" class="rounded-xl mt-5" />
  </template>

  <!-- render users -->
  <!-- <template v-else-if="$users.users.length">
    <v-avatar size="64">
      <v-img :alt="t('users.logoAlt')" lazy-src="/assets/profile-placeholder.png">
        <template v-slot:error>
          {{ post.createdBy[0] }}
        </template>
      </v-img>
    </v-avatar>
  </template> -->
</template>

<script lang="ts" setup>
// import { useRoute, useRouter } from "vue-router";
// import { useNotifyStore } from "@/stores/notify.store";

definePageMeta({
  layout: "default",
  path: "/profile/:slug/edit",
});

// const $router = useRouter();
// const $route = useRoute();
// const $notify = useNotifyStore();
// const { t } = useI18n();
// const { data } = useAuth();

// const canEdit = ref(false);

onBeforeMount(() => {
  // $users.loading = true;
  // const slug = $route.params.slug as string;
  // if (slug === data.value?.slug) {
  //   canEdit.value = true;
  // }
  // $users
  //   .getUserBySlug(slug)
  //   .catch((err) => {
  //     if (err.status === 404) {
  //       $router.push("/not-found");
  //     } else {
  //       $notify.notifyError(t("errors.unexpected"));
  //       $router.back();
  //     }
  //   })
  //   .finally(() => ($users.loading = false));
});
</script>
