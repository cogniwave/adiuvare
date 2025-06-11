import { useAuthContext } from "app/store/authContext";

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();
  const { canCreatePost } = useAuthContext();

  if (!user.value) {
    return navigateTo("/login");
  }

  if (!canCreatePost.value) {
    return navigateTo("/");
  }
});
