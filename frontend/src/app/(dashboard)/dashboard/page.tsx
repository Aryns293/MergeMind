"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import dynamic from "next/dynamic";

const StatCards = dynamic(
  () => import("@/features/dashboard/components/StatCards").then((mod) => mod.StatCards),
  { loading: () => (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 mb-8 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[140px] rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    )
  }
);

const ActivityChart = dynamic(
  () => import("@/features/dashboard/components/ActivityChart").then((mod) => mod.ActivityChart),
  { ssr: false, loading: () => <div className="h-[400px] col-span-4 rounded-2xl bg-muted/50 animate-pulse" /> }
);

const RecentReviews = dynamic(
  () => import("@/features/dashboard/components/RecentReviews").then((mod) => mod.RecentReviews),
  { ssr: false, loading: () => <div className="h-[400px] col-span-3 rounded-2xl bg-muted/50 animate-pulse" /> }
);
import { Skeleton } from "@/components/ui/skeleton";
import { Project, Review } from "@/features/projects/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsService.getProjects(),
  });

  // Determine overall stats
  let totalProjects = 0;
  let totalRepos = 0;
  let totalReviews = 0;
  let recentReviewsList: Review[] = [];
  let chartDataMap: Record<string, { count: number, timestamp: number }> = {};

  if (projects) {
    totalProjects = projects.length;
    
    projects.forEach((project) => {
      if (project.repositories) {
        totalRepos += project.repositories.length;
        
        project.repositories.forEach((repo) => {
          if (repo.reviews) {
            totalReviews += repo.reviews.length;
            
            // Map reviews with repo name for display
            const reviewsWithRepo = repo.reviews.map(r => ({
              ...r,
              repoName: repo.fullName
            }));
            recentReviewsList = [...recentReviewsList, ...reviewsWithRepo];
            
            // Aggregate for chart
            repo.reviews.forEach((review) => {
              const dateObj = new Date(review.createdAt);
              const dateKey = format(dateObj, "yyyy-MM-dd");
              if (!chartDataMap[dateKey]) {
                chartDataMap[dateKey] = { count: 0, timestamp: dateObj.getTime() };
              }
              chartDataMap[dateKey].count += 1;
            });
          }
        });
      }
    });
  }

  // Sort recent reviews
  recentReviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // Take top 10
  const topRecentReviews = recentReviewsList.slice(0, 10);
  
  // Format chart data
  const chartData = Object.values(chartDataMap)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(data => ({
      date: format(new Date(data.timestamp), "MMM dd"),
      count: data.count
    }));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full pb-10">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-12 w-64 rounded-xl shimmer" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[140px] rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-7">
          <Skeleton className="h-[400px] col-span-4 rounded-2xl shimmer" />
          <Skeleton className="h-[400px] col-span-3 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center glass rounded-2xl max-w-md mx-auto mt-10 p-8 border-destructive/20">
        <div className="text-destructive font-bold text-lg mb-2">Error loading dashboard</div>
        <p className="text-muted-foreground text-sm">{(error as any).message}</p>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "Developer";
  
  // Determine if the user is new (account created within the last 24 hours)
  const isNewUser = user?.createdAt 
    ? (new Date().getTime() - new Date(user.createdAt).getTime()) < 24 * 60 * 60 * 1000 
    : false;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 w-full pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3 border border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Workspace Ready
          </motion.div>
          <h2 className="text-3xl font-black tracking-tighter">
            {isNewUser ? "Welcome," : "Welcome back,"} <span className="gradient-text">{firstName}</span>
          </h2>
          <p className="text-muted-foreground mt-1">Here is what is happening with your code today.</p>
        </div>
      </div>
      
      <StatCards 
        totalProjects={totalProjects} 
        totalRepos={totalRepos} 
        totalReviews={totalReviews} 
      />
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-7">
        <ActivityChart data={chartData} />
        <RecentReviews reviews={topRecentReviews} />
      </div>
    </motion.div>
  );
}
