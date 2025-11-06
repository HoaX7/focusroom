import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useConfig } from "@/hooks/useConfig";
import { playNotificationSound } from "@/lib/audio";
import { cn, formatTime, getHm } from "@/lib/utils";

export type TimerHandle = {
  start: () => void;
  stop: () => void;
};

interface Props {
  logWork?: (timeElapsed: number) => void;
  onBreak: boolean;
  setOnBreak: (bool: boolean) => void;
}
const Timer = forwardRef<TimerHandle, Props>(({ logWork, onBreak, setOnBreak }, ref) => {
  const { workDuration, breakDuration, pomodoroMode } = useConfig();
  const [duration, setDuration] = useState({
    h: 0,
    m: 0,
    s: 0,
  });
  const timer = useRef<NodeJS.Timeout | null>(null);
  // in seconds
  const timeElapsed = useRef<number>(0);
  const onBreakRef = useRef(onBreak);
  useEffect(() => {
    onBreakRef.current = onBreak;
  }, [onBreak]);

  const tick = useCallback(() => {
    setDuration((prev) => {
      let { h, m, s } = prev;
      if (s > 0) {
        s -= 1;
      } else {
        s = 59;
        if (m > 0) {
          m -= 1;
        } else if (h > 0) {
          m = 59;
          h -= 1;
        } else {
          // Timer reached zero - transition between work and break
          playNotificationSound();

          setOnBreak(!onBreakRef.current);
          // Set new duration and toggle break state
          if (onBreakRef.current) {
            const { hours, minutes } = getHm(workDuration);
            return { h: hours, m: minutes, s: 0 };
          } else {
            const { hours, minutes } = getHm(breakDuration);
            return { h: hours, m: minutes, s: 0 };
          }
        }
      }
      return { h, m, s };
    });
  }, [workDuration, breakDuration, setOnBreak]);

  // non pomodoro mode
  const tickUp = useCallback(() => {
    setDuration((prev) => {
      let { h, m, s } = prev;
      if (h > 24) {
        if (timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        }
        return prev;
      }
      if (s < 59) {
        s += 1;
      } else {
        s = 0;
        if (m < 59) {
          m += 1;
        } else {
          m = 0;
          h += 1;
        }
      }
      return { h, m, s };
    });
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (pomodoroMode) {
        tick();
      } else {
        tickUp();
      }
      timeElapsed.current += 1;
    }, 1000);
  }, [tick, tickUp, pomodoroMode]);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    logWork?.(timeElapsed.current);
    timeElapsed.current = 0;
    setOnBreak(false); // Always reset to work mode when stopping
    if (pomodoroMode) {
      const { hours, minutes } = getHm(workDuration);
      setDuration({ h: hours, m: minutes, s: 0 });
    } else {
      setDuration({ h: 0, m: 0, s: 0 });
    }
  }, [workDuration, logWork, pomodoroMode, setOnBreak]);

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));
  useEffect(() => {
    // If timer is running, stop it when config changes
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
      timeElapsed.current = 0;
      setOnBreak(false); // Reset break state
    }

    // Reset duration to new config values
    if (pomodoroMode) {
      const { hours, minutes } = getHm(workDuration);
      setDuration({
        h: hours,
        m: minutes,
        s: 0,
      });
    } else {
      setDuration({ h: 0, m: 0, s: 0 });
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      timeElapsed.current = 0;
    };
  }, [workDuration, pomodoroMode, setOnBreak]);

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg p-4 glass border-2 text-white text-4xl font-mono",
        onBreak ? "border-blue-400" : "border-glass",
      )}
    >
      <div className={cn("text-4xl", onBreak ? "text-blue-400" : pomodoroMode ? "text-green-600" : "")}>
        {formatTime(duration.h, duration.m, duration.s)}
      </div>
    </div>
  );
});

Timer.displayName = "Timer";

export { Timer };
