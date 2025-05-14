<template>
  <v-list flat>
    <div v-for="(c, idx) in contacts" :key="idx">
      <v-list-item v-if="c.type === 'email'" prepend-icon="fa-solid fa-envelope">
        <a :href="`mailto:${c.contact}`">{{ c.contact }}</a>

        <template #append>
          <v-tooltip :text="t('posts.contacts.copyTooltip')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="fa-solid fa-copy"
                base-color="transparent"
                flat
                class="ml-2"
                @click="onCopy(c.contact)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-list-item>

      <v-list-item v-else-if="c.type === 'phone'" prepend-icon="fa-solid fa-phone">
        <a :href="`tel:${c.contact}`">{{ c.contact }}</a>

        <template #append>
          <v-tooltip :text="t('posts.contacts.copyTooltip')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="fa-solid fa-copy"
                base-color="transparent"
                flat
                class="ml-2"
                @click="onCopy(c.contact)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-list-item>

      <v-list-item v-else prepend-icon="fa-solid fa-file-signature" :title="c.contact">
        <template #append>
          <v-tooltip :text="t('posts.contacts.copyTooltip')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="fa-solid fa-copy"
                base-color="transparent"
                flat
                class="ml-2"
                @click="onCopy(c.contact)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-list-item>
    </div>
  </v-list>
</template>

<script setup lang="ts">
  import { useNotify } from "app/store/notify";
  import type { UserContact } from "shared/types/user";

  defineProps({
    contacts: { type: Array as PropType<UserContact[]>, required: true },
  });

  const { notifyInfo } = useNotify();
  const { t } = useI18n();

  const onCopy = (contact: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact);
      notifyInfo(t("copied"));
    } else {
      alert("Brower does not support clipboard");
    }
  };
</script>

<style scoped>
  a {
    color: initial;
  }
</style>
