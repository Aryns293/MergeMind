"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { Review } from "@/features/projects/types";
import { useRouter } from "next/navigation";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  const router = useRouter();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "IN_PROGRESS":
      case "PENDING":
        return <Clock className="h-4 w-4 text-chart-2 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'FAILED': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-emerald-500';
      case 'B': return 'text-chart-2';
      case 'C': return 'text-yellow-500';
      case 'D': return 'text-orange-500';
      case 'F': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="col-span-1 lg:col-span-3"
    >
      <Card className="h-full relative overflow-hidden group glass-subtle border-white/5 transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
          <BorderBeam size={400} duration={15} delay={2} />
        </div>
        
        {/* Glowing orbs on hover */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        
        <CardHeader className="relative z-10 pb-4">
          <CardTitle className="text-lg font-bold flex items-center justify-between group-hover:text-primary transition-colors duration-300">
            Recent Reviews
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => router.push('/reviews')}>
              View All
            </Badge>
          </CardTitle>
          <CardDescription>
            Your latest AI code review activity
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {reviews.length === 0 ? (
            <div className="flex flex-col h-[250px] items-center justify-center text-center text-muted-foreground border border-dashed border-border/50 rounded-xl bg-muted/20">
              <Code className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No recent reviews</p>
              <p className="text-xs mt-1">Connect a repo to get started</p>
            </div>
          ) : (
            <div className="overflow-y-auto overflow-x-hidden max-h-[320px] scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-border/30">
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Target</TableHead>
                    <TableHead className="text-right w-[70px]">Score</TableHead>
                    <TableHead className="text-right w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review, i) => (
                    <TableRow 
                      key={review.id} 
                      className="cursor-pointer transition-all duration-200 hover:bg-primary/5 border-b-border/30 group/row"
                      onClick={() => router.push(`/reviews/${review.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(review.status)}
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${getStatusColor(review.status).split(' ')[1]}`}>
                            {review.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium leading-none mb-1 text-foreground truncate">
                            {(review as any).repoName || "Unknown Repo"}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono truncate">
                            {review.targetType} {review.targetId?.substring(0, 7) || "N/A"}
                            <span className="text-muted-foreground/50 shrink-0">•</span>
                            <span className="font-sans shrink-0">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {review.status === 'COMPLETED' ? (
                          <div className="flex flex-col items-end">
                            <span className={`font-bold text-sm ${getGradeColor((review as any).grade)}`}>
                              {(review as any).grade || '-'}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(review as any).overallScore || 0}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/row:opacity-100 transition-all translate-x-[-10px] group-hover/row:translate-x-0" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Ensure Code icon is imported
import { Code } from "lucide-react";
