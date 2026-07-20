"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTerminalProps {
  messages: string[];
  className?: string;
  isComplete?: boolean;
}

export function AnimatedTerminal({ messages, className, isComplete }: AnimatedTerminalProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/10 bg-black/80 font-mono text-sm shadow-2xl backdrop-blur-xl overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
          <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
        <div className="mx-auto text-xs text-white/50">mergemind-ai-core</div>
      </div>
      
      <div className="p-4 h-[200px] overflow-y-auto flex flex-col justify-end">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx + msg}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 py-1"
            >
              <span className="text-primary/70 select-none">❯</span>
              <span className="text-gray-300 font-mono text-xs sm:text-sm">{msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isComplete && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex items-center gap-3 py-1"
          >
            <span className="text-primary/70">❯</span>
            <div className="w-2 h-4 bg-primary/80" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
