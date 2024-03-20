import { ref, watch } from "vue";

import { usePostsStore } from "@/stores/posts.store";

import type { FormErrors } from "@/types/form";
import type { NuxtError } from "@/exceptions";

// by convention, composable function names start with "use"
export function useFormErrors() {
  const errors = ref<FormErrors>({});
  const hasErrors = ref(false);

  const $store = usePostsStore();

  const handleErrors = (err: NuxtError) => {
    if (err.statusCode === 422) {
      // show form errors
      for (const [field, error] of Object.entries(err.data.data || {})) {
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
