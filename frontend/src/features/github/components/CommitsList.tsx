"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubCommit } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { GitCommit, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsService } from "@/features/reviews/reviews.service";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function CommitsList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: commits, isLoading, error } = useQuery({
    queryKey: ["commits", connectionId, token],
    queryFn: () => githubService.getCommits(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  const reviewMutation = useMutation({
    mutationFn: (targetId: string) => reviewsService.initiateReview({
      repoId: connectionId,
      targetType: 'COMMIT',
      targetId,
      githubToken: token!
    }),
    onSuccess: () => {
      toast.success("Review initiated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to initiate review");
    }
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <GitCommit className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">GitHub PAT is required</p>
        <p className="text-sm text-muted-foreground mt-1">Configure your Personal Access Token in Settings to view commits.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl shimmer bg-muted/20 border border-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <p className="font-semibold">Failed to load commits</p>
        <p className="text-sm mt-1 opacity-80">{(error as any).message}</p>
      </div>
    );
  }

  if (!commits || commits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <GitCommit className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">No commits found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {commits.map((commit: GithubCommit, index: number) => (
        <motion.div
          key={commit.sha}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-subtle border-white/5 rounded-xl transition-all hover:bg-muted/30 card-hover"
        >
          <div className="flex gap-4">
            <div className="mt-1 bg-background/50 p-2 rounded-lg h-fit border border-white/5 shadow-inner">
              <GitCommit className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground line-clamp-1">{commit.message}</span>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground/80 bg-background/50 px-2 py-0.5 rounded border border-border/50">{commit.author}</span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <code className="text-[11px] font-semibold bg-background/50 border border-white/10 px-2.5 py-1 rounded-md text-muted-foreground">
              {commit.sha.substring(0, 7)}
            </code>
            <a 
              href={commit.url} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="View on GitHub"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <Button
              variant="default"
              size="sm"
              className="shadow-sm shadow-primary/20 hover-glow group-hover:bg-primary transition-all"
              disabled={reviewMutation.isPending && reviewMutation.variables === commit.sha}
              onClick={() => reviewMutation.mutate(commit.sha)}
            >
              {reviewMutation.isPending && reviewMutation.variables === commit.sha ? (
                "Initiating..."
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Review
                </>
              )}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
