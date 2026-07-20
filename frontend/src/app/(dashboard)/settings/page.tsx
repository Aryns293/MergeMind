"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, User, Moon, Sun, Monitor, Activity, Code2, Cpu } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [pat, setPat] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  useEffect(() => {
    // Load existing PAT if available
    const existingPat = localStorage.getItem("github_pat");
    if (existingPat) {
      setPat(existingPat);
      setIsSaved(true);
    }
  }, []);

  const handleSavePat = () => {
    if (pat.trim().length === 0) {
      toast.error("Please enter a valid GitHub PAT.");
      return;
    }
    localStorage.setItem("github_pat", pat);
    setIsSaved(true);
    toast.success("GitHub PAT saved successfully!");
  };

  const handleClearPat = () => {
    localStorage.removeItem("github_pat");
    setPat("");
    setIsSaved(false);
    toast.info("GitHub PAT cleared.");
  };

  // Calculate API Usage
  const usageStats = useMemo(() => {
    if (!projects) return { promptTokens: 0, completionTokens: 0, totalTokens: 0, totalCostEst: 0 };
    
    let promptTokens = 0;
    let completionTokens = 0;

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          if (repo.reviews) {
            repo.reviews.forEach(review => {
              if (review.aiHistory) {
                promptTokens += review.aiHistory.promptTokens || 0;
                completionTokens += review.aiHistory.completionTokens || 0;
              }
            });
          }
        });
      }
    });

    const totalTokens = promptTokens + completionTokens;
    // Rough estimation for Gemini 1.5 Flash (free tier is free, but if paid: ~$0.075 / 1M tokens)
    const totalCostEst = (totalTokens / 1_000_000) * 0.075; 

    return { promptTokens, completionTokens, totalTokens, totalCostEst };
  }, [projects]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10"
    >
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">Settings</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your account settings and preferences.</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px] h-12 p-1 bg-background/50 border border-white/5 rounded-xl backdrop-blur-md shadow-inner">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all h-full">Profile</TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all h-full">Preferences</TabsTrigger>
          <TabsTrigger value="api-usage" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all h-full">API Usage</TabsTrigger>
          <TabsTrigger value="github" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all h-full">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 focus-visible:outline-none">
          <motion.div whileHover={{ y: -5 }} className="group relative">
            <Card className="glass-subtle border-white/5 overflow-hidden transition-all duration-300 card-hover relative group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                <BorderBeam size={300} duration={10} delay={0} />
              </div>
              
              {/* Glowing orbs on hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              
              <CardHeader className="relative z-10 pb-0">
                <CardTitle className="flex items-center gap-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <User className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  User Profile
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your public profile and personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="h-24 w-24 rounded-full bg-black/40 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-inner group-hover:border-primary/50 transition-colors">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">{user?.name || 'Unnamed User'}</h3>
                    <Badge variant="outline" className="mt-2 bg-primary/5 text-primary border-primary/20 uppercase tracking-widest text-[10px]">{user?.email}</Badge>
                  </div>
                </div>
                <div className="grid gap-2 pt-4">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                  <Input id="name" defaultValue={user?.name || ''} disabled className="bg-background/50 border-white/5 h-11 rounded-xl opacity-70" />
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    Your name is synced with your GitHub account.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 focus-visible:outline-none">
          <motion.div whileHover={{ y: -5 }} className="group relative">
            <Card className="glass-subtle border-white/5 overflow-hidden transition-all duration-300 card-hover relative group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                <BorderBeam size={300} duration={10} delay={0} />
              </div>
              
              {/* Glowing orbs on hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              
              <CardHeader className="relative z-10 pb-0">
                <CardTitle className="flex items-center gap-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Monitor className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  Appearance
                </CardTitle>
                <CardDescription className="text-sm">
                  Customize the look and feel of MergeMind AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Theme Preference</Label>
                    <div className="flex gap-4">
                      <Button 
                        variant={theme === 'light' ? 'default' : 'outline'} 
                        className={`w-32 justify-start gap-2 h-11 rounded-xl ${theme !== 'light' ? 'bg-background/50 border-white/5 hover:bg-white/5' : 'shadow-lg shadow-primary/20'}`}
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button 
                        variant={theme === 'dark' ? 'default' : 'outline'} 
                        className={`w-32 justify-start gap-2 h-11 rounded-xl ${theme !== 'dark' ? 'bg-background/50 border-white/5 hover:bg-white/5' : 'shadow-lg shadow-primary/20'}`}
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button 
                        variant={theme === 'system' ? 'default' : 'outline'} 
                        className={`w-32 justify-start gap-2 h-11 rounded-xl ${theme !== 'system' ? 'bg-background/50 border-white/5 hover:bg-white/5' : 'shadow-lg shadow-primary/20'}`}
                        onClick={() => setTheme('system')}
                      >
                        <Monitor className="h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="api-usage" className="mt-6 focus-visible:outline-none">
          <motion.div whileHover={{ y: -5 }} className="group relative">
            <Card className="glass-subtle border-white/5 overflow-hidden transition-all duration-300 card-hover relative group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                <BorderBeam size={300} duration={10} delay={0} />
              </div>
              
              {/* Glowing orbs on hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              
              <CardHeader className="relative z-10 pb-0">
                <CardTitle className="flex items-center gap-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Activity className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  API & Token Usage
                </CardTitle>
                <CardDescription className="text-sm">
                  Track your token usage across all AI code reviews. 
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                {isProjectsLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-28 rounded-2xl shimmer" />
                    <Skeleton className="h-28 rounded-2xl shimmer" />
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col p-6 bg-black/20 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2 mb-2">
                        <Cpu className="h-4 w-4 text-chart-2" />
                        Total Tokens Used
                      </span>
                      <span className="text-4xl font-black tracking-tighter text-foreground">
                        {usageStats.totalTokens.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col p-6 bg-black/20 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2 mb-2">
                        <Code2 className="h-4 w-4 text-emerald-500" />
                        Estimated Cost
                      </span>
                      <span className="text-4xl font-black tracking-tighter text-emerald-500">
                        ${usageStats.totalCostEst.toFixed(4)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mt-10 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-white/10 pb-2">Usage Breakdown</h4>
                  <div className="grid gap-0 text-sm bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                    <div className="flex justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <span className="text-muted-foreground font-medium">Prompt Tokens (Input)</span>
                      <span className="font-bold text-foreground">{usageStats.promptTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <span className="text-muted-foreground font-medium">Completion Tokens (Output)</span>
                      <span className="font-bold text-foreground">{usageStats.completionTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-4 hover:bg-white/5 transition-colors">
                      <span className="text-muted-foreground font-medium">Default Model</span>
                      <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/20 text-xs py-0.5">gemini-2.5-flash</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="github" className="mt-6 focus-visible:outline-none">
          <motion.div whileHover={{ y: -5 }} className="group relative">
            <Card className="glass-subtle border-white/5 overflow-hidden transition-all duration-300 card-hover relative group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                <BorderBeam size={300} duration={10} delay={0} />
              </div>
              
              {/* Glowing orbs on hover */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chart-2/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
              
              <CardHeader className="relative z-10 pb-0">
                <CardTitle className="flex items-center gap-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Key className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  GitHub Personal Access Token
                </CardTitle>
                <CardDescription className="text-sm">
                  Enter your GitHub Personal Access Token (PAT) to allow MergeMind to connect to your repositories and perform code reviews.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <div className="grid gap-2">
                  <Label htmlFor="pat" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Personal Access Token</Label>
                  <Input
                    id="pat"
                    type="password"
                    placeholder="Paste your GitHub PAT"
                    value={pat}
                    onChange={(e) => {
                      setPat(e.target.value);
                      if (isSaved) setIsSaved(false);
                    }}
                    className="bg-background/50 border-white/10 h-12 rounded-xl focus:border-primary/50 text-base"
                  />
                  <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                    Your token needs the <strong className="text-foreground">repo</strong> scope to read repositories and commits. This token is stored locally in your browser.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between relative z-10 border-t border-white/5 pt-5 pb-5 bg-black/10">
                <Button 
                  variant="outline" 
                  onClick={handleClearPat} 
                  disabled={!isSaved && pat.length === 0} 
                  className="rounded-xl border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all h-11 px-6"
                >
                  Clear Token
                </Button>
                <Button 
                  onClick={handleSavePat} 
                  disabled={isSaved && pat.length > 0} 
                  className={`rounded-xl h-11 px-6 font-bold shadow-lg transition-all ${isSaved ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/30" : "shadow-primary/20 hover-glow"}`}
                >
                  {isSaved ? "Saved Successfully" : "Save Token"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
