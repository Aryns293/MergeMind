import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, GitCommit, GitPullRequest, ChevronRight } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { BorderBeam } from "@/components/magicui/border-beam";

interface ReviewHistoryCardProps {
  review: {
    id: string;
    repoName: string;
    status: string;
    targetType: string;
    targetId: string;
    overallScore?: number;
    grade?: string;
    createdAt: string;
  };
}

export function ReviewHistoryCard({ review }: ReviewHistoryCardProps) {
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case 'FAILED': return <XCircle className="h-6 w-6 text-destructive" />;
      case 'IN_PROGRESS':
      case 'PENDING':
        return <Clock className="h-6 w-6 text-chart-2 animate-pulse" />;
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
    <Card 
      className="overflow-hidden glass-subtle border-white/5 transition-all duration-300 cursor-pointer group card-hover relative group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10"
      onClick={() => router.push(`/reviews/${review.id}`)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
        <BorderBeam size={300} duration={12} delay={0} />
      </div>
      
      {/* Glowing orbs on hover */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

      <div 
        className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 z-10"
        style={{ 
          backgroundColor: review.status === 'COMPLETED' ? 'hsl(var(--emerald-500) / 0.5)' : review.status === 'FAILED' ? 'hsl(var(--destructive) / 0.5)' : 'hsl(var(--chart-2) / 0.5)' 
        }} 
      />
      
      <CardContent className="p-0">
        <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ml-1">
          <div className="flex gap-5 items-start w-full sm:w-auto">
            <div className="mt-0.5 bg-background/50 p-2 rounded-xl shadow-inner border border-white/5">
              {getStatusIcon(review.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-bold text-lg text-foreground leading-none group-hover:text-primary transition-colors duration-300">{review.repoName}</h3>
                <Badge variant="outline" className={`text-[10px] uppercase tracking-widest px-2 py-0 h-5 ${getStatusColor(review.status)}`}>
                  {review.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5 font-mono bg-background/50 px-2 py-0.5 rounded border border-white/5 text-foreground/80">
                  {review.targetType === 'COMMIT' ? <GitCommit className="h-3.5 w-3.5 opacity-70" /> : <GitPullRequest className="h-3.5 w-3.5 opacity-70" />}
                  {review.targetId.substring(0, 7)}
                </span>
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="font-medium">{format(new Date(review.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                <span className="hidden sm:inline opacity-30">•</span>
                <span className="italic">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-4 sm:mt-0 self-end sm:self-center w-full sm:w-auto justify-end">
            {review.status === 'COMPLETED' && review.overallScore !== undefined && (
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black tracking-tighter leading-none">{review.overallScore}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Score</span>
              </div>
            )}
            {review.status === 'COMPLETED' && review.grade && (
              <div className="flex flex-col items-end border-l border-white/10 pl-6">
                <span className={`text-3xl font-black tracking-tighter leading-none ${getGradeColor(review.grade)}`}>{review.grade}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Grade</span>
              </div>
            )}
            
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-white/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300 ml-2 group-hover:translate-x-1">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
