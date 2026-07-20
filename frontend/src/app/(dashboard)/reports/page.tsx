"use client";

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/projects.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, CheckCircle, XCircle, Code2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Label, Legend } from 'recharts';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { BorderBeam } from '@/components/magicui/border-beam';
import { NumberTicker } from '@/components/magicui/number-ticker';

export default function ReportsPage() {
  const { theme } = useTheme();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  const stats = useMemo(() => {
    if (!projects) return null;

    let totalReviews = 0;
    let completedReviews = 0;
    let failedReviews = 0;
    let totalScore = 0;
    const dailyScores: Record<string, { total: number, count: number, timestamp: number }> = {};
    const reviewsPerRepo: Record<string, number> = {};

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          if (repo.reviews && repo.reviews.length > 0) {
            reviewsPerRepo[repo.fullName] = repo.reviews.length;
            
            repo.reviews.forEach(review => {
              totalReviews++;
              if (review.status === 'COMPLETED') {
                completedReviews++;
                if (review.overallScore !== undefined) {
                  totalScore += review.overallScore;
                  
                  // Group by day for the trend chart
                  const dateObj = new Date(review.createdAt);
                  const dateKey = format(dateObj, 'yyyy-MM-dd');
                  if (!dailyScores[dateKey]) {
                    dailyScores[dateKey] = { total: 0, count: 0, timestamp: dateObj.getTime() };
                  }
                  dailyScores[dateKey].total += review.overallScore;
                  dailyScores[dateKey].count += 1;
                }
              } else if (review.status === 'FAILED') {
                failedReviews++;
              }
            });
          }
        });
      }
    });

    const averageScore = completedReviews > 0 ? Math.round(totalScore / completedReviews) : 0;
    
    // Sort line chart by timestamp and map to required format
    const scoresWithDates = Object.values(dailyScores)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(data => ({
        date: format(new Date(data.timestamp), 'MMM dd'),
        score: Math.round(data.total / data.count)
      }));

    // Format for Pie Chart
    const statusData = [
      { name: 'Completed', value: completedReviews },
      { name: 'Failed', value: failedReviews },
      { name: 'In Progress', value: totalReviews - completedReviews - failedReviews },
    ].filter(d => d.value > 0);

    // Format for Bar Chart (Top 5 repos)
    const repoData = Object.entries(reviewsPerRepo)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReviews,
      averageScore,
      statusData,
      repoData,
      scoresWithDates
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
        <div>
          <Skeleton className="h-10 w-64 mb-2 shimmer rounded-xl" />
          <Skeleton className="h-4 w-96 shimmer" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-1 lg:col-span-4 h-96 rounded-3xl shimmer" />
          <Skeleton className="col-span-1 lg:col-span-3 h-96 rounded-3xl shimmer" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center glass rounded-3xl max-w-lg mx-auto mt-10 p-10 border border-white/10">
        <h3 className="text-2xl font-bold text-destructive">Error Loading Data</h3>
        <p className="text-muted-foreground mt-2">We couldn't fetch the required data for your reports.</p>
      </div>
    );
  }

  const COLORS = ['#10b981', '#ef4444', '#8b5cf6'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-6xl mx-auto w-full pb-10"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          High-level statistics and insights across all your AI code reviews.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div whileHover={{ y: -5 }} className="group relative h-full">
          <Card className="h-full glass-subtle border-white/5 overflow-hidden relative transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
              <BorderBeam size={200} duration={8} delay={0} />
            </div>
            
            {/* Glowing orbs on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold group-hover:text-primary transition-colors duration-300">Total Reviews</CardTitle>
              <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Code2 className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black tracking-tighter text-foreground">
                <NumberTicker value={stats.totalReviews} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium">Across all connected repositories</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="group relative h-full">
          <Card className="h-full glass-subtle border-white/5 overflow-hidden relative transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
              <BorderBeam size={200} duration={8} delay={1} />
            </div>
            
            {/* Glowing orbs on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold group-hover:text-primary transition-colors duration-300">Avg Score</CardTitle>
              <div className="bg-chart-2/10 p-2 rounded-lg border border-chart-2/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <TrendingUp className="h-4 w-4 text-chart-2 group-hover:text-primary-foreground transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black tracking-tighter text-foreground flex items-baseline">
                <NumberTicker value={stats.averageScore} />
                <span className="text-lg text-muted-foreground ml-1 font-semibold">/100</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium">Higher is better</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="group relative h-full">
          <Card className="h-full glass-subtle border-white/5 overflow-hidden relative transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
              <BorderBeam size={200} duration={8} delay={2} />
            </div>
            
            {/* Glowing orbs on hover */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold group-hover:text-primary transition-colors duration-300">Completed</CardTitle>
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {stats.statusData.find(s => s.name === 'Failed') ? (
                  <XCircle className="h-4 w-4 text-destructive group-hover:text-primary-foreground transition-colors" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-emerald-500 group-hover:text-primary-foreground transition-colors" />
                )}
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-black tracking-tighter text-foreground">
                <NumberTicker value={stats.statusData.find(s => s.name === 'Completed')?.value || 0} />
                <span className="text-lg text-muted-foreground mx-1">/</span>
                <span className="text-2xl text-muted-foreground font-semibold">{stats.totalReviews}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 font-medium">Successfully processed by AI</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 glass-subtle relative overflow-hidden group border-white/5 transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 rounded-3xl">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
            <BorderBeam size={400} duration={15} delay={1} />
          </div>
          
          {/* Glowing orbs on hover */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-chart-2/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
          
          <CardHeader className="pb-0 relative z-10">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Score Trends</CardTitle>
            <CardDescription className="text-xs font-medium">Average review scores over recent reviews.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              {stats.scoresWithDates.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.scoresWithDates} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: "var(--chart-2)" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm border border-white/5 rounded-xl bg-black/10">
                  Not enough data for trend analysis.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 glass-subtle relative overflow-hidden group border-white/5 transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 rounded-3xl">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
            <BorderBeam size={400} duration={15} delay={2} />
          </div>
          
          {/* Glowing orbs on hover */}
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-chart-2/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
          
          <CardHeader className="pb-0 relative z-10">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Review Status</CardTitle>
            <CardDescription className="text-xs font-medium">Pass vs fail rates for all reviews.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              {stats.totalReviews > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      <Label 
                        value={`${Math.round((stats.statusData.find(d => d.name === 'Completed')?.value || 0) / (stats.totalReviews || 1) * 100)}%`} 
                        position="center"
                        dy={-8}
                        className="fill-foreground font-black text-3xl"
                      />
                      <Label
                        value="Pass Rate"
                        position="center"
                        dy={16}
                        className="fill-muted-foreground font-medium text-xs"
                      />
                      {stats.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ fontWeight: 'bold', color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm border border-white/5 rounded-xl bg-black/10">
                  No review data available.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-subtle relative overflow-hidden group border-white/5 transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10 rounded-3xl">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
          <BorderBeam size={600} duration={20} delay={3} />
        </div>
        
        {/* Glowing orbs on hover */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-chart-2/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
        
        <CardHeader className="pb-0 relative z-10">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">Top Repositories by Review Volume</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            {stats.repoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.repoData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={5} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={150} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm border border-white/5 rounded-xl bg-black/10">
                No repositories reviewed yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
