export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, ready } = useUserSession();

  watch(
    () => ready.value,
    (ready) => {
      if (ready && loggedIn.value) {
        return navigateTo("/");
      }
    },
    { immediate: true },
  );
});
