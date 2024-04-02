<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">{{ $t("notFound.title") }}</div>

      <v-btn class="mt-10" to="/">{{ $t("notFound.link") }}</v-btn>
    </div>
  </div>
</template>
