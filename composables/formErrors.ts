import { ref } from "vue";
import { useRouter } from "vue-router";

import type { FormErrors } from "@/types/form";
import type { NuxtError } from "@/exceptions";

// by convention, composable function names start with "use"
export function useFormErrors() {
  const { t } = useI18n();
  const { notifyError } = useNotify();
  const $router = useRouter();
  const { logout } = useAuth();

  const errors = ref<FormErrors>({});
  const hasErrors = ref(false);

  const handleErrors = (err: NuxtError) => {
    if (err.statusCode === 401) {
      logout().then(() => $router.push({ path: "/login", query: { requireAuth: "true" } }));
      return;
    }

    if (err.statusCode === 422) {
      // show form errors
      for (const [field, error] of Object.entries(err.data.data || {})) {
        errors.value[field] = t(error);
      }

      hasErrors.value = true;
    } else {
      hasErrors.value = false;
    }

    notifyError(t("errors.unexpected"));
  };

  const clearErrors = () => {
    errors.value = {};
    hasErrors.value = false;
  };

  return { errors, hasErrors, handleErrors, clearErrors };
}
