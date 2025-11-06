import { MusicIcon, XIcon } from "lucide-react";
import { updateYtPlayer, useYtPlayer } from "@/hooks/useYtPlayer";
import { YTDefaults } from "@/lib/constants";
import { playlistCollection, type Playlist as TPlaylist } from "@/lib/tanstackDB/collections";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "../ui/item";

interface Props {
  data: TPlaylist[];
  volume?: number;
}
function Playlist(props: Props) {
  const { videoId, playerInstance } = useYtPlayer();
  return (
    <div className="flex w-full flex-col gap-4">
      <ItemGroup className="gap-4">
        {props.data.map((d) => (
          <Item asChild key={d.videoId} variant="default" role="listitem">
            <div>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  <MusicIcon size={14} className="inline mr-2" />
                  {d.title} -{" "}
                </ItemTitle>
                <ItemDescription className="flex justify-between items-center">
                  {videoId === d.videoId ? (
                    <div className="text-green-500 flex gap-1 items-center">
                      <div className="w-2 h-2 animate-pulse bg-green-500 rounded-full"></div> Now Playing
                    </div>
                  ) : (
                    <Button
                      className="bg-white hover:bg-white/90 text-black h-6"
                      type="button"
                      onClick={() => {
                        updateYtPlayer(d);
                        playerInstance?.startMusic(props.volume);
                      }}
                    >
                      Play
                    </Button>
                  )}
                  <Button
                    className="bg-transparent h-6 text-sm items-center hover:bg-neutral-700 flex gap-1 text-white"
                    type="button"
                    onClick={() => {
                      playlistCollection.delete(d.videoId);
                      updateYtPlayer(YTDefaults.lofi);
                      playerInstance?.startMusic(props.volume);
                    }}
                  >
                    <XIcon size={14} /> Clear
                  </Button>
                </ItemDescription>
              </ItemContent>
            </div>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}

export { Playlist };
