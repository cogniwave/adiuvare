import { useNotify } from "app/store/notify";
import { isFetchError } from "shared/types/guards";

export function useFormErrors() {
  const { t } = useI18n();
  const { notifyError, notifyWarning } = useNotify();
  const { clear } = useUserSession();

  const errors = ref<Record<string, string>>({});
  const hasErrors = ref(false);

  const handleErrors = (err: unknown) => {
    if (!isFetchError(err)) {
      return notifyError(t("errors.unexpected"));
    }

    if (err.statusCode === 401) {
      clear().then(() => {
        navigateTo({ path: "/login", query: { requireAuth: "true" } });
      });
      return;
    }

    if (err.statusCode === 403) {
      notifyError("errors.noPermissions");
      return;
    }

    if (err.statusCode === 422) {
      if (err.data!.data) {
        // show form errors
        for (const [field, error] of Object.entries(err.data!.data || {})) {
          errors.value[field] = error;
        }
      } else {
        notifyError(err.data!.message);
      }

      hasErrors.value = true;
      return;
    }

    if (err.statusCode === 409) {
      notifyWarning(t("errors.unverifiedUser"));
      hasErrors.value = false;
      return;
    }

    hasErrors.value = false;
    notifyError(t(err.statusMessage || "errors.unexpected"));
  };

  const clearErrors = () => {
    errors.value = {};
    hasErrors.value = false;
  };

  return { errors, hasErrors, handleErrors, clearErrors };
}
