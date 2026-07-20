"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  GitBranch,
  Settings,
  Code,
  FileText,
  Wifi,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Repositories", href: "/repositories", icon: GitBranch },
  { name: "Reviews", href: "/reviews", icon: Code },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isConnected } = useSocket();

  return (
    <aside className="hidden border-r border-border/50 bg-card/30 backdrop-blur-sm md:flex md:w-64 lg:w-72 flex-col">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-border/50 px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg shadow-primary/25 transition-shadow group-hover:shadow-primary/40">
            <Code className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">MergeMind AI</span>
            <span className="text-[10px] text-muted-foreground leading-none">Code Reviewer</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-primary to-chart-2"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>

                {/* Hover glow */}
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-primary/5 pointer-events-none" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer — Connection Status */}
      <div className="border-t border-border/50 px-4 py-3 lg:px-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="relative">
                  {isConnected ? (
                    <>
                      <Wifi className="h-3.5 w-3.5 text-chart-3" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
                    </>
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <span>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                {isConnected
                  ? "Real-time updates active via Socket.IO"
                  : "Socket.IO disconnected — reviews won't update in real-time"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
