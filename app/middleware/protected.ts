import { useAuth } from "~~/app/store/auth";

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, loading } = useAuth();

  watch(
    () => loading.value,
    (loading) => {
      if (!loading && !loggedIn.value) {
        return navigateTo("/login");
      }
    },
    { immediate: true },
  );
});
