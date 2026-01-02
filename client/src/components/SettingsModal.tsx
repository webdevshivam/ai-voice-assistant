import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";

interface SettingsModalProps {
  systemPrompt: string;
  onSave: (prompt: string) => void;
}

export function SettingsModal({ systemPrompt, onSave }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(systemPrompt);

  const handleSave = () => {
    onSave(value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Assistant Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter instructions for the AI..."
              className="h-32 resize-none bg-background/50 border-input focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Define how the AI should behave. Defaults to a helpful Hindi assistant.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
