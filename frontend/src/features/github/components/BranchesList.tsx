"use client";

import { useQuery } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubBranch } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export function BranchesList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: branches, isLoading, error } = useQuery({
    queryKey: ["branches", connectionId, token],
    queryFn: () => githubService.getBranches(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <GitBranch className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">GitHub PAT is required</p>
        <p className="text-sm text-muted-foreground mt-1">Configure your Personal Access Token in Settings to view branches.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl shimmer bg-muted/20 border border-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <p className="font-semibold">Failed to load branches</p>
        <p className="text-sm mt-1 opacity-80">{(error as any).message}</p>
      </div>
    );
  }

  if (!branches || branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <GitBranch className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">No branches found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {branches.map((branch: GithubBranch, index: number) => (
        <motion.div
          key={branch.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="group flex items-center justify-between p-4 glass-subtle border-white/5 rounded-xl transition-all hover:bg-muted/30 hover:border-white/10 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="bg-background/50 p-2 rounded-lg border border-white/5 shadow-inner">
              <GitBranch className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="font-bold text-sm text-foreground truncate max-w-[150px]">{branch.name}</span>
          </div>
          <code className="text-[11px] font-semibold text-muted-foreground bg-background/50 border border-white/10 px-2 py-1 rounded-md transition-colors group-hover:text-foreground">
            {branch.commitSha.substring(0, 7)}
          </code>
        </motion.div>
      ))}
    </div>
  );
}
