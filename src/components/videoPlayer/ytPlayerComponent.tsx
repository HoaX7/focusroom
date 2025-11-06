import { useEffect, useRef } from "react";
import { updateYtPlayer, useYtPlayer } from "@/hooks/useYtPlayer";
import YtPlayer from "./ytPlayer";

function YTComponent() {
  const playerRef = useRef<null | HTMLIFrameElement>(null);
  const { videoId, playlistId, title } = useYtPlayer();

  // useEffect(() => {
  //   (async () => {
  //     if (!props.url) return;
  //     if (props.url === YTDefaults.lofi.videoId) {
  //       updateYtPlayer(YTDefaults.lofi);
  //       return;
  //     } else if (props.url === YTDefaults.ghibli.videoId) {
  //       updateYtPlayer(YTDefaults.ghibli);
  //       return;
  //     }
  //     const details = await cacheYtMeta(props.url);
  //     const id = extractYtId(props.url);
  //     updateYtPlayer({
  //       videoId: id,
  //       title: details.title,
  //     });
  //   })();
  // }, [props.url]);

  useEffect(() => {
    if (playerRef.current) {
      const instance = new YtPlayer(playerRef.current);
      updateYtPlayer({ playerInstance: instance });
    }
  }, []);

  const src = `https://www.youtube.com/embed/${
    videoId
  }?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&playsinline=1&modestbranding=1&enablejsapi=1${
    playlistId ? `&listType=playlist&list=${playlistId}` : `&loop=1&playlist=${videoId}`
  }`;
  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{
        zIndex: -1,
      }}
    >
      <div className="inset-0 w-full h-full pointer-events-none">
        <iframe
          ref={playerRef}
          frameBorder={0}
          className="w-full h-full scale-[1.2] opacity-100 transition-opacity duration-300"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title={title}
          width="640"
          height="360"
          src={src}
        ></iframe>
      </div>
    </div>
  );
}
export { YTComponent };
