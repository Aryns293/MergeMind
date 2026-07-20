"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

import { AuroraBackground } from "@/components/aceternity/aurora-background";

export default function NotFound() {
  return (
    <AuroraBackground>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 max-w-md relative z-10 p-10 rounded-[2rem] glass shadow-2xl border border-white/10"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <div className="rounded-full bg-primary/20 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <FileQuestion className="h-24 w-24 text-primary" />
          </div>
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-primary via-chart-2 to-emerald-500">404</h1>
          <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist or has been moved into the void.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="javascript:history.back()" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto rounded-xl border-white/10" })}>
            Go Back
          </Link>
          <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto rounded-xl shadow-lg shadow-primary/25 hover-glow" })}>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
