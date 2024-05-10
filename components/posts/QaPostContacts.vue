<template>
  <v-input prepend-icon="fa-solid fa-address-book">
    <v-label class="mr-2"> {{ $t("form.contacts.title") }} </v-label>
  </v-input>

  <div class="d-flex flex-column w-100 mb-10">
    <div v-for="(c, idx) in contacts" :key="c.contact" class="contact-group">
      <v-select
        :model-value="c.type"
        :items="options"
        :label="$t('form.contacts.type')"
        @update:model-value="onUpdate($event, 'type', c.id)"
      />

      <v-text-field
        :model-value="c.contact"
        type="text"
        :label="$t('form.contacts.label')"
        :error-messages="errors[c.id]"
        :rules="[required($t), contactExists(c.id)]"
        @update:model-value="onUpdate($event, 'contact', c.id)"
      />

      <div class="button-group">
        <v-tooltip
          :text="$t('form.contacts.remove')"
          location="bottom"
          close-on-content-click
          close-delay="0"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="idx > 0"
              v-bind="props"
              rounded="xl"
              density="compact"
              variant="tonal"
              size="xs"
              icon="fa-solid fa-circle-minus"
              color="primary"
              @click="onRemove(c.id)"
            />
          </template>
        </v-tooltip>

        <v-tooltip
          :text="$t('form.contacts.add')"
          location="bottom"
          close-on-content-click
          close-delay="0"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-show="idx === contacts.length - 1"
              v-bind="props"
              rounded="xl"
              density="compact"
              class="ml-1"
              variant="tonal"
              size="xs"
              icon="fa-solid fa-circle-plus"
              color="primary"
              @click="onAdd"
            />
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "@/types/post";
import type { ContactType, UserContact } from "@/types/user";

interface Contact extends UserContact {
  id: number;
}

const { currPost } = usePosts<Post>();
const { t } = useI18n();

const errors = ref<Record<string, string>>({});
const contacts = ref<Contact[]>(
  (currPost.value.contacts || [{ contact: "", type: "phone" }]).map((c, i) => ({ ...c, id: i })),
);

const options = ref([
  { title: t("form.contacts.phone"), value: "phone" },
  { title: t("form.contacts.email"), value: "email" },
  { title: t("form.contacts.other"), value: "other" },
]);

const onUpdate = (value: ContactType | string, key: "type" | "contact", id: number) => {
  contacts.value = contacts.value.map((c) => (c.id === id ? { ...c, [key]: value } : c));
};

const contactExists = (id: number) => (val: string) => {
  return contacts.value.every((c) => c.id === id && c.contact !== val) || t("errors.contactExists");
};

const onRemove = (id: number) => {
  contacts.value = contacts.value.filter((c) => c.id !== id);
};

const onAdd = () => {
  contacts.value.push({ contact: "", type: "phone", id: contacts.value.length });
};
</script>

<style lang="scss">
.contact-group {
  display: flex;
  align-items: top;
  width: 100%;
  margin-bottom: 12px;

  & > * {
    flex: initial;
  }

  .v-select {
    width: 200px;
    margin-right: 12px;
    flex-grow: 0;
  }

  .button-group {
    display: flex;
    justify-content: end;
    width: 50px;
  }
}
</style>
