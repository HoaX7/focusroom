import { useForm } from "@tanstack/react-form";
import { MusicIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Playlist } from "@/lib/tanstackDB/collections";
import { cacheYtMeta, extractYtId, validYtLink } from "@/lib/utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FieldInfo } from "../ui/fieldInfo";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

interface Props {
  onSave: (obj: Playlist) => void;
}
function AddPlaylist(props: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    // Using zod schema breaks TS - bug on their end
    defaultValues: {
      url: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.url) return;
      try {
        const id = extractYtId(value.url);
        if (!id) {
          throw new Error("Invalid YouTube Link");
        }
        const meta = await cacheYtMeta(value.url);
        props.onSave({
          videoId: id,
          url: value.url,
          title: meta.title,
        });
        setOpen(false);
      } catch (err) {
        toast(err.message);
      } finally {
        form.reset();
      }
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full mt-3" asChild>
        <div className="py-1 cursor-pointer text-sm font-medium rounded-md flex items-center justify-center border-2 bg-white hover:bg-white/90 text-black w-full">
          <PlusIcon size={16} /> Add Playlist
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Personal Music</DialogTitle>
          <DialogDescription className="font-medium">
            Choose your own background music for this room. This won't affect what others hear.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.Field
              name="url"
              validators={{
                onChange: ({ value }) => (!value || !validYtLink(value) ? "Invalid YouTube Link" : undefined),
              }}
              // biome-ignore lint/correctness/noChildrenProp: pass
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>YouTube Link:</Label>
                    <div className="relative">
                      <MusicIcon size={18} className="absolute bottom-0 translate-y-[-50%] left-2" />
                      <Input
                        className="mt-3 pl-9"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=jf..."
                      />
                    </div>
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            // biome-ignore lint/correctness/noChildrenProp: pass
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className="mt-3 bg-white text-black hover:bg-white/90">
                {isSubmitting ? <Spinner stroke="black" /> : "Submit"}
              </Button>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddPlaylist };
