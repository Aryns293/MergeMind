"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export const AuroraBackground = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -inset-[100%] z-0 opacity-[0.15] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--primary), var(--chart-2), var(--chart-3), var(--primary))",
            backgroundSize: "200% 200%",
            filter: "blur(120px)",
            transform: "rotate(-15deg)",
          }}
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full flex-col flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
