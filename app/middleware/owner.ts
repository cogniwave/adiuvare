import { useAuth } from "~/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  const { data, loading } = useAuth();

  watch(
    () => loading.value,
    (loading) => {
      if (loading) {
        return;
      }

      if (!data.value) {
        return navigateTo("/login");
      }

      if (data.value.slug !== to.params.slug) {
        return navigateTo("/");
      }
    },
    { immediate: true },
  );
});
