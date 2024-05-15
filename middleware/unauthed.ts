import { useAuth } from "@/store/auth";

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, loading } = useAuth();

  if (!loading.value && loggedIn.value) {
    return navigateTo("/");
  }
});
