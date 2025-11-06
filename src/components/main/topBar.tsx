import { MusicIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MusicSelector } from "./musicSelector";

function TopBar() {
  return (
    <section className="flex justify-between">
      <div></div>
      <div></div>
      <div className="flex gap-2 items-center relative">
        <Popover>
          <PopoverTrigger asChild>
            <div className="hover:!bg-white/20 glass border-2 rounded-md border-glass w-12 h-12 cursor-pointer flex justify-center items-center">
              <MusicIcon size={18} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <MusicSelector />
          </PopoverContent>
        </Popover>
      </div>
    </section>
  );
}

export { TopBar };
