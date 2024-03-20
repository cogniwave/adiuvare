<template>
  <v-menu
    v-if="status === 'authenticated'"
    open-on-hover
    open-delay="0"
    close-delay="100"
  >
    <template v-slot:activator="{ props }">
      <span v-bind="props" class="pointer">
        {{ data.name }} <v-icon>expand_more</v-icon>
      </span>
    </template>

    <v-list>
      <v-list-item
        title="Perfil"
        append-icon="person"
        @click="$router.push('/profile')"
      />

      <v-list-item
        title="Sair"
        append-icon="logout"
        @click="signOut({ callbackUrl: '/', redirect: true })"
      />
    </v-list>
  </v-menu>

  <v-btn v-else variant="plain" to="login"> Iniciar sessão </v-btn>
</template>

<script setup lang="ts">
const $router = useRouter();
const { signOut, status, data } = useAuth();
</script>
