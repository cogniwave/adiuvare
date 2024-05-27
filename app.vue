<template>
  <v-app>
    <qa-loading />

    <NuxtLayout>
      <qa-navbar />

      <!-- todo: add when there's messages and stuffs -->
      <!-- <qa-notifications /> -->

      <qa-snackbar />

      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script lang="ts" setup>
const { start } = useLoadingIndicator();

onBeforeMount(() => start());

// import { useAuth } from "@/store/auth";

// // Re-construct state from cookie, also setup a cross-component sync via a useState hack, see https://github.com/nuxt/nuxt/issues/13020#issuecomment-1397282717
// const accessExpire = new Date();
// accessExpire.setMinutes(accessExpire.getMinutes() + 5);
// const accessTokenCookie = useCookie<string | null>("auth:token", {
//   maxAge: 300, // 5 minutes
//   // expires: accessExpire,
//   sameSite: "strict",
//   httpOnly: true,
//   secure: true,
// });

// const refreshExpire = new Date();
// refreshExpire.setHours(refreshExpire.getHours() + 6);
// const refreshTokenCookie = useCookie<string | null>("auth:refresh", {
//   // expires: refreshExpire,
//   maxAge: 21600, // 6 hours
//   sameSite: "strict",
//   httpOnly: true,
//   secure: true,
// });

// const { token, refreshToken, loading, refresh, setData, startInterval } = useAuth();

// onMounted(async () => {
//   console.log(accessTokenCookie.value, token.value, refreshTokenCookie.value, refreshToken.value);

//   // When the page is cached on a server, set the token on the client
//   // if access token exists, refresh does too
//   if (accessTokenCookie.value && !token.value) {
//     token.value = accessTokenCookie.value;
//     refreshToken.value = refreshTokenCookie.value as string;
//   }

//   if (refreshTokenCookie.value && (!refreshToken.value || !token.value)) {
//     await refresh();
//   }

//   startInterval();
//   setData();
//   loading.value = false;
// });

// watch(
//   () => token.value,
//   (tkn) => console.log("token watch", tkn) || (accessTokenCookie.value = tkn),
// );

// watch(
//   () => refreshToken.value,
//   (tkn) => console.log("refresh token watch", tkn) || (refreshTokenCookie.value = tkn),
// );

// watch(
//   () => accessTokenCookie.value,
//   (t) => console.log("access cookie", t),
// );
// watch(
//   () => refreshTokenCookie.value,
//   (t) => console.log("refresh cookie", t),
// );
</script>
