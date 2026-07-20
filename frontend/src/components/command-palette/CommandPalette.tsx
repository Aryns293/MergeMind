"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Folder,
  GitBranch,
  Code,
  FileText,
  Settings,
  Moon,
  Sun,
  Monitor,
  Plus,
  HelpCircle,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Listen for Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">G</kbd>
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">D</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects"))}
          >
            <Folder className="mr-2 h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/repositories"))}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            <span>Repositories</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">G</kbd>
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">R</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/reviews"))}
          >
            <Code className="mr-2 h-4 w-4" />
            <span>Review History</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">G</kbd>
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">H</kbd>
            </div>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/reports"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Reports & Analytics</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">G</kbd>
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">S</kbd>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/repositories"))}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>New Review</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">N</kbd>
              <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded border border-white/10 bg-muted/30 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">R</kbd>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System Theme</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
