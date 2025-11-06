import type YtPlayer from "@/components/videoPlayer/ytPlayer";
import type { Playlist } from "@/lib/tanstackDB/collections";

export namespace YT {
  export interface Meta {
    title: string;
    author_name: string;
    author_url: string;
    type: string;
    height: number;
    width: number;
    version: string;
    provider_name: string;
    provider_url: string;
    thumbnail_height: number;
    thumbnail_width: number;
    thumbnail_url: string;
    html: string;
  }
  export interface Player extends Playlist {
    playerInstance?: YtPlayer;
  }
}
