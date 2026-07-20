"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, GitBranch, GitFork, Code2 } from "lucide-react";
import { toast } from "sonner";
import { githubService } from "../github.service";
import { projectsService } from "@/features/projects/projects.service";
import { RemoteRepo } from "../types";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

export function ConnectRepoModal() {
  const [open, setOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const queryClient = useQueryClient();

  const token = typeof window !== "undefined" ? localStorage.getItem("github_pat") : null;

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsService.getProjects,
  });

  const { data: remoteRepos, isLoading: loadingRepos, error: reposError } = useQuery({
    queryKey: ["remoteRepos", token],
    queryFn: () => githubService.listRemoteRepos(token!),
    enabled: !!token && open, // Only fetch when modal is open and token exists
  });

  const connectMutation = useMutation({
    mutationFn: (repo: RemoteRepo) => {
      return githubService.connectRepo({
        projectId: selectedProjectId,
        githubRepoId: repo.id.toString(),
        fullName: repo.fullName,
        defaultBranch: repo.defaultBranch || "main",
        personalAccessToken: token!,
      });
    },
    onSuccess: () => {
      toast.success("Repository connected successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setSelectedRepo("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to connect repository");
    },
  });

  const handleConnect = () => {
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }
    if (!selectedRepo) {
      toast.error("Please select a repository");
      return;
    }
    const repoDetails = remoteRepos?.find(r => r.id.toString() === selectedRepo);
    if (repoDetails) {
      connectMutation.mutate(repoDetails);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 shadow-lg shadow-primary/20 hover-glow">
        <Plus className="mr-2 h-4 w-4" />
        Connect Repository
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass border-white/10 shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-chart-2 to-primary opacity-50" />
        <DialogHeader className="pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
              <Code2 className="h-5 w-5" />
            </div>
            Connect Repository
          </DialogTitle>
          <DialogDescription>
            Select a project and choose a repository from your GitHub account.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-8 text-center flex flex-col items-center gap-4 bg-muted/10 rounded-xl border border-white/5 mx-2 mb-4 mt-2"
            >
              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-inner">
                <GitFork className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1 px-4">
                <p className="font-semibold text-foreground">GitHub PAT Required</p>
                <p className="text-sm text-muted-foreground">Configure your Personal Access Token in Settings to connect repositories.</p>
              </div>
              <Button variant="outline" className="mt-2 rounded-xl" onClick={() => window.location.href = '/settings'}>
                Go to Settings
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-5 py-4"
            >
              <div className="grid gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Project</Label>
                <Select value={selectedProjectId} onValueChange={(val) => { if (val) setSelectedProjectId(val); }}>
                  <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary/50 rounded-xl h-11">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-xl">
                    {loadingProjects ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">Loading projects...</div>
                    ) : projects?.length === 0 ? (
                      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">No projects found. Create one first!</div>
                    ) : (
                      projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id} className="rounded-lg cursor-pointer">
                          {project.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GitHub Repository</Label>
                {reposError ? (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 font-medium">
                    Failed to fetch repositories. Please check your PAT validity and scopes.
                  </div>
                ) : (
                  <Select value={selectedRepo} onValueChange={(val) => { if (val) setSelectedRepo(val); }}>
                    <SelectTrigger className="bg-background/50 border-white/10 focus:ring-primary/50 rounded-xl h-11">
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 rounded-xl max-h-[300px]">
                      {loadingRepos ? (
                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Fetching from GitHub...
                        </div>
                      ) : remoteRepos?.length === 0 ? (
                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">No repositories found.</div>
                      ) : (
                        remoteRepos?.map((repo) => (
                          <SelectItem key={repo.id} value={repo.id.toString()} className="rounded-lg cursor-pointer my-0.5">
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{repo.fullName}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Button
                className="w-full mt-2 h-11 rounded-xl shadow-lg shadow-primary/20 hover-glow"
                onClick={handleConnect}
                disabled={connectMutation.isPending || !selectedProjectId || !selectedRepo}
              >
                {connectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <GitFork className="mr-2 h-4 w-4" />
                    Connect Repository
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
