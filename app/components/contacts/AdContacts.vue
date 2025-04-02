<template>
  <v-input prepend-icon="fa-solid fa-address-book">
    <div>
      <v-label class="mr-2"> {{ t("form.contacts.title") }} </v-label>

      <small v-if="errors.contacts" class="d-block color-error">{{ errors.contacts }} </small>
    </div>

    <template #append>
      <v-btn variant="tonal" color="primary" density="compact" flat @click="onAdd">
        {{ t("form.contacts.add") }}
      </v-btn>
    </template>
  </v-input>

  <div class="d-flex flex-column w-100 mb-10">
    <div v-for="c in proxyContacts" :key="c.contact" class="contact-group">
      <v-select
        :model-value="c.type"
        :items="options"
        :label="t('form.contacts.type')"
        @update:model-value="onUpdateType($event, c.contact, c.id)"
        @blur="persistUpdate"
      />

      <v-text-field
        type="text"
        class="w-100"
        :model-value="c.contact"
        :hint="c.type === 'phone' ? t('form.contacts.phoneHint') : undefined"
        :label="t('form.contacts.label')"
        :error-messages="errors[c.id]"
        :rules="[
          required(t),
          contactExists(c.id),
          ...(c.type === 'email' ? [isValidEmail(t)] : []),
          ...(c.type === 'phone' ? [isValidPhone(t)] : []),
        ]"
        @update:model-value="onUpdateValue(c.type, $event, c.id)"
        @blur="persistUpdate"
      />

      <div class="button-group">
        <v-tooltip :text="t('form.contacts.remove')" location="bottom" close-on-content-click close-delay="0">
          <template #activator="{ props }">
            <v-btn
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ContactType, UserContact } from "shared/types/user";

  interface Contact extends UserContact {
    id: number;
  }

  const $emit = defineEmits<{
    (e: "update", payload: UserContact[]): void;
  }>();

  const $props = defineProps({
    contacts: { type: Array as PropType<UserContact[]>, default: () => [] },
    error: { type: String, default: "" },
  });

  const { t } = useI18n();
  const errors = ref<Record<string, string>>({});
  const proxyContacts = ref<Contact[]>(
    $props.contacts.map((c, i) => ({
      ...c,
      id: i,
    })),
  );

  const options = [
    { title: t("form.contacts.phone"), value: "phone" },
    { title: t("form.contacts.email"), value: "email" },
    { title: t("form.contacts.other"), value: "other" },
  ];

  const contactEdits = ref<Record<number, Contact>>({});

  const onUpdateType = (type: ContactType, contact: string, id: number) => {
    contactEdits.value[id] = { id, type, contact };

    proxyContacts.value = proxyContacts.value.map((c) => {
      return c.id === id ? { type, contact, id } : c;
    });
  };

  const onUpdateValue = (type: ContactType, contact: string, id: number) => {
    contactEdits.value[id] = { id, type, contact };
  };

  const contactExists = (id: number) => (val: string) => {
    return !proxyContacts.value.some((c) => c.id !== id && c.contact === val) || t("errors.contactExists");
  };

  const onRemove = (id: number) => {
    proxyContacts.value = proxyContacts.value.filter((c) => c.id !== id);
    // in this case needs to be dynamic because it's the generated id
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete contactEdits.value[id];
  };

  const onAdd = () => {
    proxyContacts.value.push({ contact: "", type: "phone", id: proxyContacts.value.length });
  };

  const persistUpdate = () => {
    proxyContacts.value = proxyContacts.value.map((c) => {
      return contactEdits.value[c.id] ? contactEdits.value[c.id]! : c;
    });

    $emit(
      "update",
      proxyContacts.value.map((c) => ({ contact: c.contact, type: c.type })),
    );
  };

  watch(
    () => $props.error,
    (error) => (errors.value.contacts = error),
  );
</script>

<style lang="scss">
  .contact-group {
    display: flex;
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
      align-items: center;
    }
  }
</style>
