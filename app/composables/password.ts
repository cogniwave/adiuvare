export const usePassword = () => {
  let visibility = false;

  const password = ref<string>("");
  const password2 = ref<string>("");
  const passwordFieldType = ref<"text" | "password">("password");
  const visibilityIcon = ref<"eye" | "eye-slash">("eye");

  // form controls
  const switchVisibility = () => {
    if (visibility) {
      visibility = false;
      passwordFieldType.value = "password";
      visibilityIcon.value = "eye";
    } else {
      visibility = true;
      passwordFieldType.value = "text";
      visibilityIcon.value = "eye-slash";
    }
  };

  return { switchVisibility, password, password2, passwordFieldType, visibilityIcon };
};
