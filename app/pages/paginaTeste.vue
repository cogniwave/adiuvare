<template>
    <v-container>
        <h2 class="mb-6">Teste de Componentes de Formulário</h2>

        <v-form @submit.prevent>
            <v-text-field label="Campo de Texto Padrão" class="mb-2" />

            <v-textarea label="Área de Texto" class="mb-2" />

            <v-select :items="['Item 1', 'Item 2', 'Item 3']" label="Seletor" class="mb-2" />

            <v-autocomplete :items="['Opção A', 'Opção B']" label="Autocompletar" class="mb-2" />

            <v-btn type="submit" color="primary">
                Enviar (Teste)
            </v-btn>
        </v-form>
    </v-container>
</template>

<script setup>
    // Lógica de teste pode ser adicionada aqui
</script>