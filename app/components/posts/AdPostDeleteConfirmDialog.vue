<template>
  <ad-confirm-dialog
    :model-value="deleteDialogVisible"
    :title="t('posts.confirm.deleteTitle')"
    :confirm-text="t('posts.confirm.deleteConfirm')"
    :cancel-text="t('posts.confirm.cancel')"
    :loading="submitting"
    @click:submit="submit"
    @click:close="deleteDialogVisible = false"
  >
    <i18n-t scope="global" keypath="posts.confirm.deleteDescription" tag="span">
      <b class="font-italic">{{ currPost.title }}</b>
    </i18n-t>
  </ad-confirm-dialog>
</template>

<script setup lang="ts">
  import { usePosts } from "app/store/posts";
  import type { PostDeletePayload } from "shared/types/post";

  const $emit = defineEmits<{
    (e: "delete", id: string): void;
  }>();

  const { t } = useI18n();
  const { deleteDialogVisible, currPost } = usePosts();

  const submitting = ref<boolean>(false);

  const submit = () => {
    submitting.value = true;

    $emit("delete", (currPost.value as PostDeletePayload).id);
  };

  watch(
    () => deleteDialogVisible.value,
    (val) => val && (submitting.value = false),
  );
</script>

<style scoped>
  :deep(.v-card) {
    background-color: rgba(var(--v-theme-surface));
  }
</style>
