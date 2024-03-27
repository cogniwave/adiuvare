import { useNotifyStore } from "@/stores/notify.store";
import { useSessionStore } from "@/stores/session.store";

export default defineNuxtRouteMiddleware(async (ev) => {
  if (process.server) {
    const { data } = useAuth();
    ev.user = data.value;
    return;
  }

  const nuxtApp = useNuxtApp();

  // run on startup
  if (nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    const $session = useSessionStore();
    const $notify = useNotifyStore();
    const $router = useRouter();
    const { signOut, refresh, refreshToken, token, data } = useAuth();

    if (!refreshToken.value) {
      return;
    }

    try {
      await refresh();

      $session.init(token.value as string, data.value);
    } catch (_) {
      // invalidate token and whatnot
      signOut({ redirect: false });

      // redirect user to login page and show a lil message
      $notify.notifyWarning("Sessão expirada, inicie novamente");
      $router.replace("/login");
    }
  }
});
