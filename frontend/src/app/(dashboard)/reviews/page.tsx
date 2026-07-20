"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/projects.service';
import { ReviewHistoryCard } from '@/features/reviews/components/ReviewHistoryCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Code } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function ReviewHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [repoFilter, setRepoFilter] = useState('ALL');

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  // Extract and enrich all reviews from projects
  const { allReviews, uniqueRepos } = useMemo(() => {
    if (!projects) return { allReviews: [], uniqueRepos: [] };

    const repos = new Set<string>();
    const reviews: any[] = [];

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          repos.add(repo.fullName);
          if (repo.reviews) {
            repo.reviews.forEach(review => {
              reviews.push({
                ...review,
                repoName: repo.fullName,
              });
            });
          }
        });
      }
    });

    // Sort by newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { allReviews: reviews, uniqueRepos: Array.from(repos) };
  }, [projects]);

  // Apply filters and search
  const filteredReviews = useMemo(() => {
    return allReviews.filter(review => {
      const matchesSearch = 
        review.repoName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        review.targetId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || review.status === statusFilter;
      const matchesRepo = repoFilter === 'ALL' || review.repoName === repoFilter;

      return matchesSearch && matchesStatus && matchesRepo;
    });
  }, [allReviews, searchQuery, statusFilter, repoFilter]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
        <div>
          <Skeleton className="h-10 w-48 mb-2 shimmer rounded-xl" />
          <Skeleton className="h-4 w-96 shimmer" />
        </div>
        <Skeleton className="h-16 w-full shimmer rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full shimmer rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center glass rounded-2xl max-w-md mx-auto mt-10 p-8 border-destructive/20">
        <h3 className="text-xl font-bold text-destructive mb-2">Error Loading Reviews</h3>
        <p className="text-muted-foreground text-sm">{(error as any)?.message || "Could not fetch review history."}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-5xl mx-auto w-full pb-10"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tighter">Review History</h1>
        <p className="text-muted-foreground mt-1">
          Browse and filter your past AI code reviews across all repositories.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center glass p-3 rounded-2xl border-white/10 shadow-lg">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by repo or commit SHA..."
            className="pl-11 h-11 bg-background/50 border-white/10 rounded-xl focus:border-primary/50 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || 'ALL')}>
            <SelectTrigger className="w-[150px] h-11 bg-background/50 border-white/10 rounded-xl font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10 rounded-xl">
              <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
              <SelectItem value="COMPLETED" className="rounded-lg">Completed</SelectItem>
              <SelectItem value="PENDING" className="rounded-lg">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS" className="rounded-lg">In Progress</SelectItem>
              <SelectItem value="FAILED" className="rounded-lg">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={repoFilter} onValueChange={(val) => setRepoFilter(val || 'ALL')}>
            <SelectTrigger className="w-[180px] h-11 bg-background/50 border-white/10 rounded-xl font-medium">
              <SelectValue placeholder="Repository" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10 rounded-xl max-h-[300px]">
              <SelectItem value="ALL" className="rounded-lg">All Repositories</SelectItem>
              {uniqueRepos.map(repo => (
                <SelectItem key={repo} value={repo} className="rounded-lg">{repo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
        <span>Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}</span>
      </div>

      {filteredReviews.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 border border-white/10 rounded-3xl glass-subtle flex flex-col items-center justify-center h-[400px]"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 border border-primary/20 shadow-lg shadow-primary/10 mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">No reviews found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">Try adjusting your filters, searching for a different term, or initiate a new code review.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ReviewHistoryCard review={review} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
