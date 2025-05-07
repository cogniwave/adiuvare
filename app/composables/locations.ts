import { normalize } from "~/app/utils";
import localidades from "~/public/assets/localidades.json";

export const useLocations = () => {
  const { t } = useI18n();

  const filteringLocations = ref(false);
  const locations = ref<string[]>([]);
  const noDataText = ref(t("form.post.locationNoData"));

  let query = "";

  const filterLocations = (input: string) => {
    // for some reason using input directly makes it so its not the latest up to date value
    query = input;

    if (filteringLocations.value) {
      noDataText.value = t("form.post.locationSearching");
      return;
    }

    if (query?.length <= 2) {
      filteringLocations.value = false;
      noDataText.value = t("form.post.locationNoData");
      return;
    }

    filteringLocations.value = true;
    noDataText.value = t("form.post.locationSearching");

    debounce(() => {
      query = normalize(query);

      locations.value = localidades.filter((f) => normalize(f).includes(query));

      filteringLocations.value = false;
    }, 1000);
  };

  return { filterLocations, locations, filteringLocations, noDataText };
};
