import { createRoot, type Root } from "react-dom/client";
import ShowConfetti from "@/components/confetti/showConfetti";

let root: Root;
const el = typeof window !== "undefined" ? document.getElementById("modal-root") : null;
if (typeof window !== "undefined" && el) root = createRoot(el);

export function popConfetti() {
  root?.render(<ShowConfetti />);
}
