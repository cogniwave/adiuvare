import { ref } from "vue";

import { useNotifyStore } from "@/stores/notify.store";

import type { FormErrors } from "@/types/form";
import type { NuxtError } from "@/exceptions";

// by convention, composable function names start with "use"
export function useFormErrors() {
  const errors = ref<FormErrors>({});
  const hasErrors = ref(false);

  const { t } = useI18n();
  const $notifyStore = useNotifyStore();

  const handleErrors = (err: NuxtError) => {
    if (err.statusCode === 422) {
      // show form errors
      for (const [field, error] of Object.entries(err.data.data || {})) {
        errors.value[field] = t(error);
      }

      hasErrors.value = true;
    } else {
      hasErrors.value = false;
    }

    $notifyStore.notifyError(t("errors.unexpected"));
  };

  const clearErrors = () => {
    errors.value = {};
    hasErrors.value = false;
  };

  return { errors, hasErrors, handleErrors, clearErrors };
}
