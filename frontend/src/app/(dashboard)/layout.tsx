"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Topbar } from "@/features/dashboard/components/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const FloatingAssistant = dynamic(
  () => import("@/components/ui/floating-assistant").then((mod) => mod.FloatingAssistant),
  { ssr: false }
);
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // AuthProvider will already redirect, but just as a safety net:
  if (!user) {
    return null; 
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col relative z-0">
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto relative gradient-mesh">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative z-10 flex-1"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
