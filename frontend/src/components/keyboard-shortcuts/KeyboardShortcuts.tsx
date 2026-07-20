"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Escape — close modals
      if (e.key === "Escape") {
        setShowHelp(false);
        setPendingKey(null);
        return;
      }

      // ? — show help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Handle two-key combos (G + X, N + X)
      if (pendingKey === "g") {
        setPendingKey(null);
        switch (e.key) {
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            return;
          case "r":
            e.preventDefault();
            router.push("/repositories");
            return;
          case "h":
            e.preventDefault();
            router.push("/reviews");
            return;
          case "s":
            e.preventDefault();
            router.push("/settings");
            return;
        }
      }

      if (pendingKey === "n") {
        setPendingKey(null);
        if (e.key === "r") {
          e.preventDefault();
          router.push("/repositories");
          return;
        }
      }

      // Set pending key for combos
      if (e.key === "g" && !e.ctrlKey && !e.metaKey) {
        setPendingKey("g");
        // Auto-clear after 1 second
        setTimeout(() => setPendingKey(null), 1000);
        return;
      }

      if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
        setPendingKey("n");
        setTimeout(() => setPendingKey(null), 1000);
        return;
      }
    },
    [pendingKey, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Open Command Palette" },
    { keys: ["G", "D"], description: "Go to Dashboard" },
    { keys: ["G", "R"], description: "Go to Repositories" },
    { keys: ["G", "H"], description: "Go to Review History" },
    { keys: ["G", "S"], description: "Go to Settings" },
    { keys: ["N", "R"], description: "New Review" },
    { keys: ["?"], description: "Show Keyboard Shortcuts" },
    { keys: ["Esc"], description: "Close Modal" },
  ];

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-md glass border-white/10 shadow-2xl rounded-2xl overflow-hidden p-0">
        <div className="p-6 pb-2 border-b border-white/5 bg-background/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 shadow-inner">
                <span className="text-lg leading-none">⌨️</span>
              </div>
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2 font-medium">
              Navigate faster with keyboard shortcuts.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="grid gap-1 p-4 bg-black/10">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-3 px-4 rounded-xl group hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300 cursor-default"
            >
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">{shortcut.description}</span>
              <div className="flex items-center gap-1.5">
                {shortcut.keys.map((key, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && (
                      <span className="text-muted-foreground/40 text-xs font-black">
                        +
                      </span>
                    )}
                    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg border border-white/10 bg-background/50 text-xs font-mono font-bold text-foreground shadow-sm group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 shadow-black/20 group-hover:shadow-primary/10">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
