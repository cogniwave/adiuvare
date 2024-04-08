interface GeoApifyResult {
  results: Array<{
    datasource?: {
      sourcename: string;
      attribution: string;
      license: string;
      url: string;
    };
    name?: string;
    country?: string;
    country_code?: string;
    county?: string;
    city?: string;
    lon?: number;
    lat?: number;
    postcode?: string;
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    category?: string;
    timezone?: {
      name: string;
      offset_STD: string;
      offset_STD_seconds: number;
      offset_DST: string;
      offset_DST_seconds: number;
      abbreviation_STD: string;
      abbreviation_DST: string;
    };
    plus_code?: string;
    plus_code_short?: string;
    result_type?: string;
    rank?: {
      confidence: number;
      match_type: string;
      importance?: number;
      confidence_city_level?: number;
    };
    place_id?: string;
    bbox?: {
      lon1: number;
      lat1: number;
      lon2: number;
      lat2: number;
    };
    suburb?: string;
  }>;
  query: {
    text: string;
    parsed: {
      city: string;
      expected_type: string;
    };
  };
}

// https://apidocs.geoapify.com/docs/geocoding/address-autocomplete/#autocomplete
export const getCities = async (text: string) => {
  if (!text) {
    return [];
  }

  // TODO: FIX THIS, should not use usefetch
  const result = await useFetch<GeoApifyResult>(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&type=city&limit=5&filter=countrycode:pt&lang=pt&format=json&apiKey=0ab5e06c6b3e4d3b8f470a4e02130184`,
    { headers: { "Content-Type": "application/json" } },
  );

  return result.data.value
    ? result.data.value.results.map(({ formatted }) => formatted)
    : [];
};
