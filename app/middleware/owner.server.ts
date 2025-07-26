export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loggedIn, ready } = useUserSession();

  const checkOwnership = () => {
    if (!user.value) {
      return navigateTo("/login");
    }

    if (user.value.slug !== to.params.slug) {
      return navigateTo("");
    }
  };

  if (ready.value) {
    if (loggedIn.value) {
      return checkOwnership();
    }

    return;
  }

  return new Promise((resolve) => {
    watch(
      () => ready.value,
      () => resolve(checkOwnership()),
    );
  });
});
