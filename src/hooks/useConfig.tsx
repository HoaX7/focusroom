import { CACHE_KEYS, defaultConfig } from "@/lib/constants";
import { getStoreHook, initStore, updateStore } from "@/lib/store";
import type { Config } from "@/types";

const config = initStore(defaultConfig, CACHE_KEYS.config);
export const useConfig = () => {
  return getStoreHook(config);
};

export const updateConfig = (data: Partial<Config>) => {
  return updateStore(config, data, CACHE_KEYS.config);
};
