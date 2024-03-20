import { useNotifyStore } from "@/stores/notify.store";

export default defineNuxtRouteMiddleware(async () => {
  if (process.server) {
    return;
  }

  const nuxtApp = useNuxtApp();
  const $notify = useNotifyStore();
  const $router = useRouter();

  // run on startup
  if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    const { signOut, refresh } = useAuth();

    try {
      await refresh();
    } catch (_) {
      // invalidate token and whatnot
      signOut({ redirect: false });

      // redirect user to login page and show a lil message
      $notify.notifyWarning("Sessão expirada, inicie novamente");
      $router.replace("/login");
    }
  }
});
