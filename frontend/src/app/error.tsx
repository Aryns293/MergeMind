"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

import { AuroraBackground } from "@/components/aceternity/aurora-background";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuroraBackground>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 max-w-md w-full relative z-10 p-10 rounded-[2rem] glass border border-destructive/20 shadow-2xl"
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <div className="rounded-full bg-destructive/20 p-8 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <AlertOctagon className="h-24 w-24 text-destructive" />
          </div>
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-destructive to-orange-500">System Error</h1>
          <p className="text-muted-foreground text-lg font-medium">
            An unexpected glitch occurred in the matrix. Our team has been notified.
          </p>
        </div>

        <div className="p-4 bg-black/20 rounded-xl text-left overflow-auto max-h-32 border border-white/5 shadow-inner">
          <p className="text-xs text-muted-foreground font-mono break-words">
            {error.message || "Unknown Application Error"}
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" onClick={() => reset()} className="w-full sm:w-auto h-12 px-8 rounded-xl border-white/10 hover:bg-white/5">
            Try again
          </Button>
          <Link href="/dashboard" className={buttonVariants({ className: "w-full sm:w-auto h-12 px-8 rounded-xl shadow-lg shadow-primary/25 hover-glow" })}>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
