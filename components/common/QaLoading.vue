<template>
  <div v-if="isLoading" class="loader-container">
    <div class="loader" />
  </div>
</template>

<script setup lang="ts">
const { isLoading, start } = useLoadingIndicator();

onBeforeMount(() => start());
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 99999999;
  background: #f7f7f7;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .loader {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    border: 4px solid #0000;
    border-radius: 50%;
    border-right-color: rgba(var(--v-theme-primary));
    animation: l15 1s infinite linear;

    &::before,
    &::after {
      content: "";
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 50%;
      animation: l15 2s infinite;
    }

    &::after {
      margin: 8px;
      animation-duration: 3s;
    }
  }
}

@keyframes l15 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
