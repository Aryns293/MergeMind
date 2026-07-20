import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewResponse } from '../types';
import { Progress } from '@/components/ui/progress';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { motion } from 'framer-motion';

interface ReviewSummaryCardProps {
  review: ReviewResponse;
}

export function ReviewSummaryCard({ review }: ReviewSummaryCardProps) {
  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
      case 'B': return 'text-chart-2 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]';
      case 'C': return 'text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]';
      case 'D': return 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]';
      case 'F': return 'text-destructive drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-chart-2';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <Card className="shadow-2xl shadow-primary/5 glass border-white/10 overflow-hidden relative transition-all duration-500 hover:shadow-primary/10 hover:border-white/20">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <BorderBeam size={400} duration={12} delay={0} />
        </div>
        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="flex justify-between items-center text-2xl font-bold tracking-tight">
            <span>Executive Summary</span>
            {review.grade && (
              <div className="flex items-center gap-3 bg-black/40 px-5 py-2 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Grade</span>
                <span className={`text-4xl font-black ${getGradeColor(review.grade)}`}>
                  {review.grade}
                </span>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-base">Overall AI assessment of these changes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {review.overallScore !== undefined && (
            <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-end">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Quality Score</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-foreground">
                    <NumberTicker value={review.overallScore} />
                  </span>
                  <span className="text-muted-foreground font-semibold text-lg">/100</span>
                </div>
              </div>
              <Progress 
                value={review.overallScore} 
                className="h-4 rounded-full overflow-hidden bg-black/50 shadow-inner" 
                indicatorClassName={getScoreColorClass(review.overallScore)}
              />
            </div>
          )}
          
          <div className="bg-muted/10 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90 shadow-inner font-medium">
            {review.summary || "No summary provided."}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
