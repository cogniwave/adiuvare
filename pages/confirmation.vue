<template>
  <v-row align-content="center">
    <v-col cols="4" offset="4" md="6" offset-md="3" sm="8" offset-sm="2">
      <v-card class="shadow-24 q-pb-md" :loading="submitting">
        <v-card-title>Confirmação de conta</v-card-title>

        <v-card-item>
          <template v-if="submitting">
            <template v-if="success">
              <p class="mb-3">
                A sua conta está confirmada, já pode
                <router-link to="login" class="text-blue-grey pb-1">
                  iniciar sessão
                </router-link>
              </p>
            </template>

            <template v-else>
              <p class="mb-3">
                Não foi possível confirmar a sua conta, contacte o apoio ao
                cliente
              </p>
            </template>
          </template>

          <p>Aguarde um momento enquanto confirmamos a conta</p>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { confirmAccount } from "@/services/user.service";

const submitting = ref<boolean>(true);
const success = ref<boolean>(true);

const $route = useRoute();

useHead({ title: "Confirmação de conta" });

onBeforeMount(() => {
  const token = $route.params.token;

  if (!token) {
    submitting.value = false;
    return (success.value = false);
  }

  confirmAccount($route.params?.token)
    .catch(() => (success.value = false))
    .finally(() => (submitting.value = false));
});
</script>

<style lang="scss" scoped>
a {
  transition: 0.2s;
  opacity: 0.6;

  &:hover {
    transition: 0.2s;
    opacity: 1;
  }
}
</style>
