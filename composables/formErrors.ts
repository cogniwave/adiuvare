import { ref, watch } from "vue";

import type { FormErrors } from "@/types/form";
import { AxiosError } from "@/exceptions";
import { usePostsStore } from "@/stores/posts";

// by convention, composable function names start with "use"
export function useFormErrors() {
  const errors = ref<FormErrors>({});
  const hasErrors = ref(false);

  const $store = usePostsStore();

  const handleErrors = (err: unknown) => {
    // unexpected error happened somewhere
    if (!(err instanceof AxiosError)) {
      return;
    }

    if (err.status === 422) {
      // show form errors
      for (const [field, error] of Object.entries(err.data.errors)) {
        errors.value[field] = error;
      }

      hasErrors.value = true;
    } else {
      hasErrors.value = false;
    }
  };

  const clearErrors = () => {
    errors.value = {};
    hasErrors.value = false;
  };

  watch(
    () => $store.formErrors,
    (formErrors) => {
      if (!Object.keys(formErrors)) {
        return clearErrors();
      }

      hasErrors.value = true;
      errors.value = formErrors;
    },
  );

  return { errors, hasErrors, handleErrors, clearErrors };
}
