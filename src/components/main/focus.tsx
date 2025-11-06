import { CheckIcon, FlameIcon, PartyPopperIcon, PlayIcon, TimerIcon, TrophyIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { updateConfig, useConfig } from "@/hooks/useConfig";
import { useYtPlayer } from "@/hooks/useYtPlayer";
import { popConfetti } from "@/lib/alert";
import { CACHE_KEYS } from "@/lib/constants";
import { cn, delay, formatTime, getHms } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ConfigSettings } from "./configSettings";
import { Timer, type TimerHandle } from "./timer";

interface FocusProps {
  isLockedIn: boolean;
  setIsLockedIn: (value: boolean) => void;
}

function Focus({ isLockedIn, setIsLockedIn }: FocusProps) {
  const { playerInstance } = useYtPlayer();
  const { pomodoroMode } = useConfig();
  const [onBreak, setOnBreak] = useState(false);
  // seconds
  const [deepWork, setDeepWork] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [open, setOpen] = useState(false);

  const timerRef = useRef<TimerHandle>(null);
  const logWork = (te: number) => {
    popConfetti();
    setDeepWork(getHms(te));
    setOpen(true);
  };
  const handleStartSession = async () => {
    try {
      setIsLockedIn(true);
      // Get saved volume from localStorage
      const savedVolume = localStorage.getItem(CACHE_KEYS.volume);
      const volume = savedVolume ? Number.parseInt(savedVolume, 10) : 50;
      playerInstance?.startMusic(volume);
      timerRef.current?.start();
    } catch {}
  };

  const handleCancel = () => {
    playerInstance?.seekTo(0);
    playerInstance?.mute();
    setIsLockedIn(false);
    setOnBreak(false); // Reset break state
    timerRef.current?.stop();
  };

  const handleComplete = () => {
    setIsLockedIn(false);
    setOnBreak(false); // Reset break state
    timerRef.current?.stop();
  };
  return (
    <section className={cn("glass border-glass border-2 rounded-md p-3")}>
      <div className="text-md font-bold text-center flex justify-center">
        {isLockedIn ? (
          <div className="flex gap-2 items-center">
            <FlameIcon size={18} /> Locked in
          </div>
        ) : (
          "Ready to lock in?"
        )}
      </div>
      <div className="mt-3 flex justify-center">
        <div
          className={cn(
            "rounded-full border-2 font-bold p-1 px-4 text-sm",
            onBreak
              ? "text-blue-400 border-blue-400 bg-blue-400/20"
              : "text-green-500 border-green-600 bg-green-600/20",
          )}
        >
          {onBreak ? "Take a break" : isLockedIn ? "Focused" : "Focus"}
        </div>
      </div>
      <div className="mt-5 flex gap-4 items-center">
        <Timer logWork={logWork} ref={timerRef} onBreak={onBreak} setOnBreak={setOnBreak} />
        <div className="flex gap-2">
          <div className="gap-2 flex">
            <Button
              className={cn(
                "w-12 h-12 rounded-full",
                isLockedIn ? "bg-red-500/30 hover:bg-red-500/50" : "bg-white hover:bg-white/90",
              )}
              onClick={isLockedIn ? handleCancel : handleStartSession}
              type="button"
            >
              {isLockedIn ? <XIcon size={24} strokeWidth={3} /> : <PlayIcon size={24} stroke="black" />}
            </Button>
            <Button
              className="w-12 h-12 rounded-full bg-green-500/30 hover:bg-green-500/50"
              type="button"
              disabled={!isLockedIn}
              onClick={handleComplete}
            >
              <CheckIcon size={24} strokeWidth={3} />
            </Button>
            <ConfigSettings
              onUpdate={async () => {
                timerRef.current?.stop();
                await delay(100);
                timerRef.current?.start();
              }}
            />
          </div>
          <div
            className={cn(
              "px-3 flex items-center rounded-md border-2",
              pomodoroMode ? "border-green-600 bg-green-600/20" : "border-glass glass",
            )}
          >
            <div className="flex gap-2 items-center">
              <TimerIcon size={24} className={pomodoroMode ? "stroke-green-600" : ""} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Switch
                      checked={pomodoroMode}
                      onCheckedChange={(checked) => {
                        updateConfig({ pomodoroMode: checked });
                      }}
                      disabled={isLockedIn}
                      // className={cn(pomodoroMode ? "data-[state=checked]:bg-pomodoro" : "")}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pomodoro Mode</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="flex gap-1 items-center justify-center">
              Deep Work Complete! <PartyPopperIcon size={24} className="text-yellow-400" />
            </DialogTitle>
          </DialogHeader>
          <div className="!font-mono text-3xl text-center">
            {formatTime(deepWork.hours, deepWork.minutes, deepWork.seconds)}
          </div>
          <div className="text-gray-400">Great job staying focused! You are one step closer to your goal.</div>
          <Button
            className="flex items-center justify-center bg-white text-black hover:bg-white/90"
            type="button"
            onClick={() => {
              setOpen(false);
              setDeepWork({ hours: 0, minutes: 0, seconds: 0 });
            }}
          >
            <TrophyIcon size={24} /> Continue Building
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export { Focus };
