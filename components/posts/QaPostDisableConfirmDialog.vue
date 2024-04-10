<template>
  <qa-confirm-dialog
    :model-value="$store.disableDialogVisible"
    :title="$t('posts.confirm.disableTitle')"
    :confirm-text="$t('posts.confirm.disableConfirm')"
    :cancel-text="$t('posts.confirm.cancel')"
    :loading="submitting"
    @click:submit="submit"
    @click:close="$store.toggleDisableDialog(false)"
  >
    <i18n-t scope="global" keypath="posts.confirm.disableDescription" tag="span">
      <b class="font-italic">{{ $store.post.title }}</b>
    </i18n-t>
  </qa-confirm-dialog>
</template>

<script setup lang="ts">
import { usePostsStore } from "@/stores/posts.store";
import { useNotifyStore } from "@/stores/notify.store";
import type { PostStateTogglePayload } from "@/types/post";

const $store = usePostsStore();
const $notifyStore = useNotifyStore();

const submitting = ref<boolean>(false);

const submit = () => {
  submitting.value = true;

  $store
    .disablePost(($store.post as PostStateTogglePayload).id)
    .catch($notifyStore.notifyError)
    .finally(() => (submitting.value = false));
};
</script>

<style scoped>
:deep(.v-card) {
  background-color: rgba(var(--v-theme-surface));
}
</style>
