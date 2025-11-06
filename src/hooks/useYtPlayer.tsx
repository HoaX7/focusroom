import { CACHE_KEYS } from "@/lib/constants";
import { getStoreHook, updateStore } from "@/lib/store";
import { ytPlayerInfo } from "@/lib/store/yt";
import type { YT } from "@/types/yt";

export const useYtPlayer = () => {
  return getStoreHook(ytPlayerInfo);
};
export const updateYtPlayer = (data: Partial<YT.Player>) => {
  return updateStore(ytPlayerInfo, data);
};
