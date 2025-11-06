import React, { useImperativeHandle, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { TCanvasConfettiAnimationOptions, TCanvasConfettiInstance } from "react-canvas-confetti/dist/types";

const COLOR_MAP: Record<string, string> = {
  blue: "#26ccff",
  purple: "#a25afd",
  red: "#ff5e7e",
  green: "#88ff5a",
  yellow: "#fcff42",
  orange: "#ffa62d",
  pink: "#ff36ff",
};

export interface IConfettiProps extends TCanvasConfettiAnimationOptions {
  popConfetti: () => void;
}

const Confetti = React.forwardRef<IConfettiProps>((options, ref) => {
  const instance = useRef<TCanvasConfettiInstance | null>(null);

  useImperativeHandle(ref, () => {
    return {
      popConfetti() {
        popConfetti();
      },
    };
  });
  // biome-ignore lint/suspicious/noAssignInExpressions: pass
  const onInitHandler = ({ confetti }: { confetti: TCanvasConfettiInstance }) => (instance.current = confetti);
  const popConfetti = () => {
    instance?.current?.({
      colors: Object.values(COLOR_MAP),
      shapes: ["circle", "square"],
      particleCount: 300,
      disableForReducedMotion: true,
      angle: 90,
      spread: 360,
      startVelocity: 45,
      decay: 0.9,
      gravity: 1,
      ...options,
    });
  };

  return <ReactCanvasConfetti onInit={onInitHandler} globalOptions={{ useWorker: true }} />;
});

Confetti.displayName = "Confetti";
export default Confetti;
