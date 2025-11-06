import { useForm } from "@tanstack/react-form";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateConfig, useConfig } from "@/hooks/useConfig";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { FieldInfo } from "../ui/fieldInfo";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";

// curl -XPOST 'https://api.unkey.com/v2/keys.verifyKey' \
//   -H 'Authorization: Bearer <UNKEY_ROOT_KEY>' \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "key": "3Za7i45akwj73XvxWJWD9sV8"
//   }'
function ConfigSettings({ onUpdate }: { onUpdate?: () => void }) {
  const { workDuration, breakDuration, longBreakDuration } = useConfig();
  const [open, setOpen] = useState(false);
  const form = useForm({
    // Using zod schema breaks TS - bug on their end
    defaultValues: {
      workDuration,
      breakDuration,
      longBreakDuration,
    },
    onSubmit: async ({ value }) => {
      if (!value.workDuration || !value.breakDuration) return;
      try {
        updateConfig(value);
        setOpen(false);
        onUpdate?.();
      } catch (err) {
        toast(err.message);
      } finally {
        form.reset();
      }
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        <div className="flex items-center cursor-pointer justify-center rounded-full !w-12 h-12 glass hover:!bg-white/20 border-glass">
          <SettingsIcon size={18} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pomodoro Timer Settings</DialogTitle>
          <DialogDescription className="font-medium">Customize your pomodoro interval settings</DialogDescription>
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
              name="workDuration"
              validators={{
                onChange: ({ value }) =>
                  !value || value < 25 || value > 1440 ? "Please provide a number between 25 and 1440" : undefined,
              }}
              // biome-ignore lint/correctness/noChildrenProp: pass
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Work Duration (in minutes):</Label>
                    <Input
                      className="mt-3"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      required
                      type="number"
                      min={25}
                      max={1440} // 1 day
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <div className="mt-3">
            <form.Field
              name="breakDuration"
              validators={{
                onChange: ({ value }) =>
                  !value || value < 5 || value > 60 ? "Please provide a number between 5 and 60" : undefined,
              }}
              // biome-ignore lint/correctness/noChildrenProp: pass
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Break Duration (in minutes):</Label>
                    <Input
                      className="mt-3"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      required
                      type="number"
                      min={5}
                      max={60}
                    />
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
                {isSubmitting ? <Spinner stroke="black" /> : "Save"}
              </Button>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ConfigSettings };
