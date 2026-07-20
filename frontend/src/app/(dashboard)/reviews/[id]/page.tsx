"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { reviewsService } from "@/features/reviews/reviews.service";
import { ReviewSummaryCard } from "@/features/reviews/components/ReviewSummaryCard";
import { ReviewCommentsList } from "@/features/reviews/components/ReviewCommentsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, GitCommit, GitPullRequest, Code, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ReviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;

  const { data: review, isLoading, error } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewsService.getReview(reviewId),
    enabled: !!reviewId,
    refetchInterval: (query) => {
      const status = query.state?.data?.status;
      if (status === 'PENDING' || status === 'IN_PROGRESS') {
        return 3000;
      }
      return false;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-muted-foreground font-medium animate-pulse">Loading review report...</span>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4 glass rounded-3xl max-w-lg mx-auto mt-10 p-10 border border-white/10">
        <h3 className="text-2xl font-bold text-destructive">Error Loading Review</h3>
        <p className="text-muted-foreground">
          {(error as any)?.message || "Could not find the requested review."}
        </p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'FAILED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-6xl mx-auto w-full pb-12"
    >
      <div className="flex items-center gap-4 bg-background/30 p-4 rounded-3xl border border-white/5 backdrop-blur-md shadow-sm">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full bg-background/50 border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all h-10 w-10 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-foreground">
              <div className="bg-primary/10 p-2 rounded-xl text-primary shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              AI Code Review Report
            </h1>
            <div className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-3">
              <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md border border-white/5">ID: {review.id.substring(0, 8)}...</span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-md border border-white/5 font-mono">
                {review.targetType === 'COMMIT' ? (
                  <GitCommit className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <GitPullRequest className="h-3.5 w-3.5 opacity-70" />
                )}
                {review.targetType}: {review.targetId.substring(0, 7)}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full ${getStatusColor(review.status)}`}>
            {review.status}
          </Badge>
        </div>
      </div>

      {(review.status === 'PENDING' || review.status === 'IN_PROGRESS') ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-16 border border-white/10 rounded-3xl glass-subtle shadow-lg flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
          </div>
          <h3 className="text-3xl font-black tracking-tighter mb-3">Review in Progress</h3>
          <p className="text-muted-foreground max-w-md text-lg">
            Our AI is currently analyzing this code. This page will automatically update when finished.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <ReviewSummaryCard review={review} />

          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              Detailed Findings
            </h2>
            <ReviewCommentsList comments={review.comments || []} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
