<template>
  <qa-confirm-dialog
    :model-value="disableDialogVisible"
    :title="t('posts.confirm.disableTitle')"
    :confirm-text="t('posts.confirm.disableConfirm')"
    :cancel-text="t('posts.confirm.cancel')"
    :loading="submitting"
    @click:submit="submit"
    @click:close="disableDialogVisible = false"
  >
    <i18n-t scope="global" keypath="posts.confirm.disableDescription" tag="span">
      <b class="font-italic">{{ currPost.title }}</b>
    </i18n-t>
  </qa-confirm-dialog>
</template>

<script setup lang="ts">
import { usePosts } from "@/store/posts";
import { useNotify } from "@/store/notify";
import type { Post, PostDisablePayload } from "@/types/post";

const { notifyError } = useNotify();
const { $csrfFetch } = useNuxtApp();
const { t } = useI18n();
const { disableDialogVisible, currPost, posts } = usePosts<PostDisablePayload>();

const submitting = ref<boolean>(false);

const submit = async () => {
  submitting.value = true;

  try {
    await $csrfFetch<Post>(`/api/v1/posts/${currPost.value.id}`, {
      body: { action: "disable" },
      method: "patch",
    });

    posts.value = posts.value.filter((p) => p.id !== currPost.value.id);
  } catch (err: any) {
    notifyError(err);
  } finally {
    submitting.value = false;
    disableDialogVisible.value = false;
  }
};
</script>

<style scoped>
:deep(.v-card) {
  background-color: rgba(var(--v-theme-surface));
}
</style>
