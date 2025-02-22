export default defineNuxtRouteMiddleware((to) => {
  const { user, ready } = useUserSession();

  watch(
    () => ready.value,
    (ready) => {
      if (!ready) {
        return;
      }

      if (!user.value) {
        return navigateTo("/login");
      }

      if (user.value.slug !== to.params.slug) {
        return navigateTo("/");
      }
    },
    { immediate: true },
  );
});
