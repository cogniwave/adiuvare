import { useAuth } from "@/store/auth";

export default defineNuxtRouteMiddleware((to) => {
  const { data } = useAuth();

  if (!data.value) {
    return navigateTo("/login");
  }

  if (data.value.slug !== to.params.slug) {
    return navigateTo("/");
  }
});
