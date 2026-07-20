"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { ConnectRepoModal } from "@/features/github/components/ConnectRepoModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { GitBranch, Code, ExternalLink, CalendarDays, Code2, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Repository } from "@/features/projects/types";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";

export default function RepositoriesPage() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2 shimmer rounded-xl" />
            <Skeleton className="h-4 w-64 shimmer" />
          </div>
          <Skeleton className="h-10 w-32 shimmer rounded-xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col opacity-50 border-white/5 bg-background/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2 shimmer" />
                <Skeleton className="h-4 w-1/2 shimmer" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-2/3 shimmer" />
                <Skeleton className="h-4 w-1/2 shimmer" />
              </CardContent>
              <CardFooter className="pt-4 border-t border-border/50">
                <Skeleton className="h-10 w-full shimmer rounded-lg" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center glass rounded-2xl max-w-md mx-auto mt-10 p-8 border-destructive/20">
        <div className="text-destructive font-bold text-lg mb-2">Error loading repositories</div>
        <p className="text-muted-foreground text-sm">{(error as any).message}</p>
      </div>
    );
  }

  // Flatten all repos from all projects
  const allRepos = projects?.reduce((acc: Repository[], project) => {
    if (project.repositories) {
      const reposWithProject = project.repositories.map(repo => ({
        ...repo,
        projectName: project.name
      }));
      return [...acc, ...reposWithProject];
    }
    return acc;
  }, []) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 w-full pb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Repositories</h2>
          <p className="text-muted-foreground mt-1">
            Manage your connected GitHub repositories.
          </p>
        </div>
        <ConnectRepoModal />
      </div>

      {allRepos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center justify-center h-[50vh] border border-white/10 rounded-3xl gap-4 glass-subtle overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-5 border border-primary/20 shadow-lg shadow-primary/10"
          >
            <Code2 className="h-16 w-16 text-primary mb-4" />
          </motion.div>
          
          <div className="text-center z-10">
            <h3 className="text-xl font-bold tracking-tight mt-2 text-foreground">No repositories connected</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 mx-auto">
              You haven't connected any GitHub repositories yet. Click the button above to link one and start reviewing code.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {allRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative h-full"
            >
              <Card className="flex flex-col h-full glass-subtle border-white/5 overflow-hidden transition-all duration-300 card-hover group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                  <BorderBeam size={300} duration={10} delay={index} />
                </div>
                {/* Decorative glowing orbs on hover */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-chart-2/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div className="rounded-xl bg-primary/10 p-2.5 text-primary shadow-inner group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-secondary/50 border-secondary-foreground/10 text-secondary-foreground font-bold tracking-widest uppercase">
                      {(repo as any).projectName}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold truncate mt-2 group-hover:text-primary transition-colors duration-300">
                    {repo.fullName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 relative z-10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-black/20 p-2.5 rounded-lg border border-white/5 group-hover:border-primary/20 transition-colors duration-300">
                      <Code className="h-4 w-4 text-primary/70" /> 
                      <span className="flex-1">Default branch</span>
                      <span className="font-mono text-xs font-semibold text-foreground bg-white/10 px-2 py-0.5 rounded">
                        {repo.defaultBranch}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground p-2 rounded-lg bg-white/5 border border-white/5">
                        <CalendarDays className="h-4 w-4 text-primary/70" /> 
                        <span className="truncate text-xs">Connected {formatDistanceToNow(new Date(repo.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground p-2 rounded-lg bg-white/5 border border-white/5">
                        <Activity className="h-4 w-4 text-chart-2/70" /> 
                        <span className="text-xs">{(repo as any).reviews?.length || 0} Reviews</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-white/5 relative z-10 mt-auto bg-black/10">
                  <Link href={`/repositories/${repo.id}`} className={buttonVariants({ variant: "default", className: "w-full shadow-lg shadow-primary/20 group-hover:bg-primary group-hover:text-primary-foreground hover-glow transition-all duration-300" })}>
                    View Repository Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
