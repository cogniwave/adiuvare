export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, ready } = useUserSession();

  if (ready.value) {
    if (!loggedIn.value) {
      return navigateTo("/");
    }

    return;
  }

  return new Promise((resolve) => {
    watch(
      () => ready.value,
      () => !loggedIn.value && resolve(navigateTo("/")),
    );
  });
});
