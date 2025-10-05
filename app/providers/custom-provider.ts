// https://github.com/nuxt/image/issues/1821
import type { ProviderGetImage } from "@nuxt/image";
import { createOperationsGenerator } from "#image";
import { joinURL } from "ufo";

const ops = createOperationsGenerator();

export const getImage: ProviderGetImage = (src, { modifiers }) => {
  // if starts with /assets it's images from public/assets
  if (!src.startsWith("/assets")) {
    src = joinURL(useRuntimeConfig().public.baseAssetUrl, src);
  }

  const query = ops(modifiers) || "";
  return { url: `${src}${query ? `?${query}` : ""}` };
};
