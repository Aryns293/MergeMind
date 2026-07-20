"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { githubService } from "../github.service";
import { GithubPullRequest } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { GitPullRequest, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsService } from "@/features/reviews/reviews.service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function PullRequestsList({ connectionId }: { connectionId: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: pullRequests, isLoading, error } = useQuery({
    queryKey: ["pullRequests", connectionId, token],
    queryFn: () => githubService.getPullRequests(connectionId, token!),
    enabled: !!token && !!connectionId,
  });

  const reviewMutation = useMutation({
    mutationFn: (targetId: string) => reviewsService.initiateReview({
      repoId: connectionId,
      targetType: 'PR',
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
        <GitPullRequest className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">GitHub PAT is required</p>
        <p className="text-sm text-muted-foreground mt-1">Configure your Personal Access Token in Settings to view PRs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl shimmer bg-muted/20 border border-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20">
        <p className="font-semibold">Failed to load pull requests</p>
        <p className="text-sm mt-1 opacity-80">{(error as any).message}</p>
      </div>
    );
  }

  if (!pullRequests || pullRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
        <GitPullRequest className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
        <p className="text-muted-foreground font-medium">No open pull requests found</p>
        <p className="text-sm text-muted-foreground mt-1">All caught up!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {pullRequests.map((pr: GithubPullRequest, index: number) => (
        <motion.div
          key={pr.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-subtle border-white/5 rounded-xl transition-all hover:bg-muted/30 card-hover"
        >
          <div className="flex gap-4">
            <div className={`mt-1 h-fit p-2 rounded-lg border shadow-inner ${pr.state === 'open' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-purple-500/10 border-purple-500/20'}`}>
              <GitPullRequest className={`h-5 w-5 ${pr.state === 'open' ? 'text-emerald-500' : 'text-purple-500'}`} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground line-clamp-1">{pr.title}</span>
                <Badge variant="outline" className={`text-[9px] uppercase tracking-wider px-1.5 py-0 ${pr.state === 'open' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-purple-500 border-purple-500/30 bg-purple-500/5'}`}>
                  {pr.state}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                <span className="font-bold text-foreground">#{pr.number}</span>
                <span className="opacity-50">•</span>
                <span className="font-semibold text-foreground/80 bg-background/50 px-2 py-0.5 rounded border border-border/50">{pr.user}</span>
                <span className="opacity-50">•</span>
                <span className="flex items-center gap-1">
                  {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <a 
              href={pr.htmlUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-white/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="default"
              size="sm"
              className="shadow-sm shadow-primary/20 hover-glow group-hover:bg-primary transition-all rounded-lg"
              disabled={reviewMutation.isPending && reviewMutation.variables === pr.number.toString()}
              onClick={() => reviewMutation.mutate(pr.number.toString())}
            >
              {reviewMutation.isPending && reviewMutation.variables === pr.number.toString() ? (
                "Initiating..."
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Review PR
                </>
              )}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
