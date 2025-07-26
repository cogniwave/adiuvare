<template>
  <v-list flat density="compact">
    <template v-for="(c, idx) in contacts" :key="idx">
      <v-list-item :prepend-icon="getIcon(c.type)" slim>
        <a v-if="c.type === 'email'" :href="`mailto:${c.contact}`">{{ c.contact }}</a>

        <a v-else-if="c.type === 'phone'" :href="`tel:${c.contact}`">{{ c.contact }}</a>

        <template #append>
          <v-tooltip :text="t('posts.contacts.copyTooltip')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="fa-copy"
                base-color="transparent"
                flat
                variant="text"
                color="subtext"
                size="small"
                class="ml-2"
                @click="onCopy(c.contact)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-list-item>
    </template>
  </v-list>
</template>

<script setup lang="ts">
  import { useNotify } from "app/store/notify";
  import type { ContactType, EntityContact } from "shared/types/contact";

  defineProps({
    contacts: { type: Array as PropType<EntityContact[]>, required: true },
  });

  const { notifyInfo } = useNotify();
  const { t } = useI18n();

  const onCopy = (contact: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact);
      notifyInfo(t("copied"));
    } else {
      alert("Browser does not support clipboard");
    }
  };

  const getIcon = (type: ContactType): string => {
    if (type === "email") {
      return "fa-envelope";
    }

    if (type === "phone") {
      return "fa-phone";
    }

    return "fa-file-signature";
  };
</script>

<style scoped>
  a {
    color: initial;
  }

  .v-list {
    background: var(--v-theme-background);
  }
</style>
