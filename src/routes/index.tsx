import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Focus } from "@/components/main/focus";
import { TopBar } from "@/components/main/topBar";
import { YTComponent } from "@/components/videoPlayer/ytPlayerComponent";

export const Route = createFileRoute("/")({
  component: Home,
  // loader: async () => {
  //   await playlistCollection.preload();
  // },
});

function Home() {
  const [isLockedIn, setIsLockedIn] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute top-0 mt-5 mx-5 w-full right-0 z-20">
        <TopBar />
      </div>
      <YTComponent />
      {/* Background darkening overlay when locked in */}
      {isLockedIn && (
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-10" />
      )}
      <div className="absolute bottom-0 mb-5 left-[50%] -translate-x-[50%] z-20">
        <Focus isLockedIn={isLockedIn} setIsLockedIn={setIsLockedIn} />
      </div>
    </div>
  );
}
