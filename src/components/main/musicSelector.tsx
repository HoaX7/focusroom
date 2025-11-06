import { useLiveQuery } from "@tanstack/react-db";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useYtPlayer } from "@/hooks/useYtPlayer";
import { CACHE_KEYS, YTDefaults } from "@/lib/constants";
import { type Playlist, playlistCollection } from "@/lib/tanstackDB/collections";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { AddPlaylist } from "./addPlaylist";
import { Playlist as PlaylistComponent } from "./playlists";

function MusicSelector() {
  const { data } = useLiveQuery((q) => q.from({ playlist: playlistCollection }));
  const { playerInstance } = useYtPlayer();
  const [isMuted, setIsMuted] = useState(true);

  // Load volume from localStorage or default to 50
  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.volume);
      return saved ? Number.parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  // Sync volume with player on mount
  useEffect(() => {
    if (playerInstance) {
      playerInstance.setVolume(volume);
    }
  }, [playerInstance, volume]);

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    playerInstance?.setVolume(vol);
    // Persist to localStorage
    try {
      localStorage.setItem(CACHE_KEYS.volume, vol.toString());
    } catch (error) {
      console.warn("Failed to save volume to localStorage:", error);
    }
  };
  const onMute = (mute: boolean) => {
    mute ? playerInstance?.mute() : playerInstance?.unMute();
    setIsMuted(mute);
  };
  const handleSave = (obj: Playlist) => {
    playlistCollection.insert(obj);
  };
  return (
    <div>
      <div className="m-3 grid grid-cols-2 gap-2 rounded-md text-center border-2 border-glass glass p-1 font-medium">
        <div className="col-span-1">
          <div className="text-black bg-white rounded-md py-1">Lofi</div>
        </div>
        {/* <div className="col-span-1 rounded py-1">Ghibli</div> */}
      </div>
      <div className="m-3 flex gap-2 items-center">
        <Button
          className="rounded-full glass border-glass border-2 hover:!bg-white/20"
          type="button"
          onClick={() => onMute(!isMuted)}
          style={{
            width: "28px",
            height: "28px",
          }}
        >
          {isMuted ? <VolumeXIcon size={18} /> : <Volume2Icon size={18} />}
        </Button>
        <div className="flex-grow">
          <Slider
            max={100}
            step={1}
            defaultValue={[volume]}
            value={[volume]}
            onValueChange={(val) => {
              handleVolumeChange(val[0]);
            }}
          />
        </div>
        <div className="text-sm">{volume}%</div>
      </div>
      <Separator />
      <div className="">
        <div className="m-3">
          <PlaylistComponent
            data={[
              ...new Set([
                {
                  videoId: YTDefaults.lofi.videoId,
                  title: YTDefaults.lofi.title,
                },
                {
                  videoId: YTDefaults.ghibli.videoId,
                  title: YTDefaults.ghibli.title,
                },
                ...data,
              ]),
            ]}
            volume={volume}
          />
          {data.length < 5 && <AddPlaylist onSave={handleSave} />}
        </div>
      </div>
    </div>
  );
}

export { MusicSelector };
