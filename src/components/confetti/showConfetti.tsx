import React, { useEffect, useRef } from "react";
import Confetti, { type IConfettiProps } from "./confettiPopup";

export default function ShowConfetti() {
  const ref = useRef<IConfettiProps | null>(null);
  useEffect(() => {
    ref.current?.popConfetti?.();
  });
  return <Confetti ref={ref} />;
}
