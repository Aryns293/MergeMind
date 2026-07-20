import * as React from "react";

import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { Code } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuroraBackground>
      <div className="w-full max-w-sm md:max-w-md p-6 relative z-10">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg shadow-primary/25">
              <Code className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">MergeMind AI</span>
              <span className="text-[10px] text-muted-foreground leading-none">Code Reviewer</span>
            </div>
          </Link>
        </div>

        {children}
      </div>
    </AuroraBackground>
  );
}
