import type { YT } from "@/types/yt";
import { CACHE_KEYS, YTDefaults } from "../constants";
import { initStore } from ".";

export const ytPlayerInfo = initStore<YT.Player>(YTDefaults.lofi, CACHE_KEYS.currentPlaylist);
