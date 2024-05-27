import { useRouter } from "vue-router";

import type { LoginPayload, LoginResult, TokenUser } from "@/types/user";

const REFRESH_INTERVAL = 240000; // 4 minutes, 1 less than token duration

let interval: NodeJS.Timeout | null = null;

export const useAuth = () => {
  const $router = useRouter();

  const storageUser = useLocalStorage<TokenUser>("qa:user", null, {
    writeDefaults: false,
    serializer: {
      read: (val) => (val ? JSON.parse(val) : null),
      write: (val) => JSON.stringify(val),
    },
  });

  const data = useState<TokenUser | null>("auth:data", () => null);

  // If session exists, initialize as not loading
  const loading = useState<boolean>("auth:loading", () => true);

  const token = useState<string | null>("auth:token", () => null);

  const refreshToken = useState<string | null>("auth:refresh", () => null);

  const loggedIn = computed<boolean>(() => !loading.value && !!data.value);

  const _reset = () => {
    data.value = null;
    token.value = null;
    refreshToken.value = null;
    storageUser.value = null;

    if (interval) {
      clearInterval(interval);
    }
  };

  // make request to refresh, update tokens
  const refresh = async () => {
    loading.value = true;

    if (!refreshToken.value) {
      _reset();
      console.log("aqui?");
      $router.push("/");
      loading.value = false;
      return false;
    }

    try {
      const result = await $fetch<string>("/api/v1/auth/refresh", {
        method: "post",
        body: { token: refreshToken.value },
      });

      if (!result) {
        logout();
        return false;
      }

      token.value = result;

      if (storageUser.value && !data.value) {
        data.value = storageUser.value;

        startInterval(true);
      }

      return true;
    } catch (err) {
      logout();
      return false;
    } finally {
      loading.value = false;
    }
  };

  const login = async (payload: LoginPayload) => {
    loading.value = true;
    const result = await $fetch<LoginResult>("/api/v1/auth/login", {
      method: "post",
      body: payload,
    });

    if (!result) {
      loading.value = false;
      return;
    }

    token.value = result.accessToken;
    refreshToken.value = result.refreshToken;
    data.value = result.user;
    loading.value = false;
    storageUser.value = result.user;

    startInterval();
    loading.value = false;

    $router.replace("/");
  };

  // make request to logout, update tokens
  const logout = async () => {
    loading.value = true;

    _reset();
    try {
      await $fetch("/api/v1/auth/logout", { method: "delete" });
      loading.value = false;

      if ($router.currentRoute.value.path !== "/") {
        $router.replace("/");
      }
    } catch (err) {
      console.warn("failed to refresh", err);
      window.location.reload();
    }
  };

  const setData = () => {
    console.log("setData", token.value, refreshToken.value, storageUser.value, data.value);
    if (storageUser.value) {
      data.value = storageUser.value;
    }
  };

  const startInterval = (reset: boolean = false) => {
    console.log("starting interval", interval, reset);
    if (!interval || reset) {
      interval = setInterval(refresh, REFRESH_INTERVAL);
    }
  };

  return {
    data,
    loggedIn,
    token,
    refreshToken,
    loading,
    logout,
    login,
    refresh,
    setData,
    startInterval,
  };
};
