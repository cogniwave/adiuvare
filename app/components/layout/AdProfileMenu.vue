<template>
  <template v-if="ready">   
    <v-menu v-if="loggedIn">
      <template #activator="{ props }">
        <span v-bind="props" class="cursor-pointer ml-5">
          {{ t('email.greetings') }} {{ user?.name || '<nome de user>' }}       
        </span>
      </template>      
    </v-menu>
  </template>
</template>

<script setup lang="ts">  
  const { loggedIn, user, ready } = useUserSession();
  const { t } = useI18n();
</script>

<style scoped>
  span {
    color: rgba(var(--v-theme-primary));
  }
</style>
