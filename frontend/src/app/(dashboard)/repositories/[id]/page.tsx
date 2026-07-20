"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { projectsService } from "@/features/projects/projects.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommitsList } from "@/features/github/components/CommitsList";
import { BranchesList } from "@/features/github/components/BranchesList";
import { PullRequestsList } from "@/features/github/components/PullRequestsList";
import { GitBranch, GitCommit, GitPullRequest, ArrowLeft, Code, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Repository } from "@/features/projects/types";
import { motion } from "framer-motion";

export default function RepositoryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = params.id as string;

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  let repository: Repository | null = null;
  if (projects) {
    for (const project of projects) {
      if (project.repositories) {
        const found = project.repositories.find(r => r.id === repoId);
        if (found) {
          repository = found;
          break;
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64 shimmer rounded-xl" />
        <Skeleton className="h-96 w-full mt-4 shimmer rounded-2xl" />
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4 glass rounded-3xl max-w-lg mx-auto mt-10 p-10 border border-white/10">
        <Code2 className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
        <div className="text-xl font-bold tracking-tight">Repository not found</div>
        <p className="text-sm text-muted-foreground max-w-sm">The repository you are looking for does not exist or you do not have access to it.</p>
        <Button onClick={() => router.push('/repositories')} variant="default" className="mt-4 shadow-lg hover-glow">
          Back to Repositories
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 w-full pb-10"
    >
      <div className="flex items-center gap-4 bg-background/30 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push('/repositories')}
          className="rounded-full bg-background/50 border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary shadow-inner">
              <Code2 className="h-5 w-5" />
            </div>
            {repository.fullName}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm flex items-center gap-2">
            <Code className="h-4 w-4 text-primary/70" /> 
            Default branch: 
            <span className="font-mono text-xs font-semibold text-foreground bg-white/10 px-2 py-0.5 rounded">
              {repository.defaultBranch}
            </span>
          </p>
        </div>
      </div>

      <Tabs defaultValue="commits" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] h-11 p-1 bg-muted/30 border border-border/50 rounded-xl">
          <TabsTrigger value="commits" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
            <GitCommit className="h-4 w-4" /> Commits
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
            <GitBranch className="h-4 w-4" /> Branches
          </TabsTrigger>
          <TabsTrigger value="pulls" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
            <GitPullRequest className="h-4 w-4" /> Pull Requests
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="commits" className="mt-0 focus-visible:outline-none">
            <CommitsList connectionId={repository.id} />
          </TabsContent>
          <TabsContent value="branches" className="mt-0 focus-visible:outline-none">
            <BranchesList connectionId={repository.id} />
          </TabsContent>
          <TabsContent value="pulls" className="mt-0 focus-visible:outline-none">
            <PullRequestsList connectionId={repository.id} />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
