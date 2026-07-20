"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code,
  GitBranch,
  Shield,
  Zap,
  Eye,
  ArrowRight,
  Code2,
  Cpu,
  FileSearch,
  ChevronRight,
  Sparkles,
  Activity,
  BarChart3,
  Lock,
  Gauge,
  Terminal,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

/* ─── Sub-components ─── */

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-chart-2/10 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-chart-3/8 blur-[140px] animate-pulse" style={{ animationDelay: "4s" }} />
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />
    </div>
  );
}

function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shadow-lg shadow-primary/25">
              <Code className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">MergeMind AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#tech" className="hover:text-foreground transition-colors">Tech Stack</a>
          <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ size: "sm", className: "shadow-lg shadow-primary/25" })}>
              Dashboard
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Sign In
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm", className: "shadow-lg shadow-primary/25" })}>
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-6 overflow-hidden">
      <GridBackground />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Code Reviews
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6"
        >
          Ship better code,{" "}
          <span className="gradient-text">faster</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          MergeMind connects to your GitHub repositories and uses AI to perform deep,
          real-time code reviews on commits and pull requests — analyzing security,
          performance, and code quality in seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base shadow-xl shadow-primary/25 hover-glow" })}>
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href="/register" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base shadow-xl shadow-primary/25 hover-glow" })}>
                Start Reviewing Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8 text-base" })}>
                <Code2 className="mr-2 h-4 w-4" />
                Sign In with GitHub
              </Link>
            </>
          )}
        </motion.div>

        {/* Hero visual — terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="relative rounded-2xl border border-border/50 overflow-hidden glass shadow-2xl shadow-primary/10 max-w-3xl mx-auto">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">mergemind-ai — code review</span>
            </div>
            {/* Terminal body */}
            <div className="p-6 font-mono text-sm text-left space-y-2 bg-background/80">
              <TerminalLine delay={0.6} text="$ mergemind review facebook/react@a1b2c3d" />
              <TerminalLine delay={1.2} text="✓ Repository connected" color="text-emerald-500" />
              <TerminalLine delay={1.6} text="✓ Fetching commit diff..." color="text-emerald-500" />
              <TerminalLine delay={2.0} text="⟳ AI analyzing code changes..." color="text-chart-2" />
              <TerminalLine delay={2.6} text="✓ Security scan complete — 0 vulnerabilities" color="text-emerald-500" />
              <TerminalLine delay={3.0} text="✓ Performance analysis — 2 suggestions" color="text-yellow-500" />
              <TerminalLine delay={3.4} text="✓ Code quality score: 94/100 (Grade: A)" color="text-emerald-500" />
              <TerminalLine delay={3.8} text="" />
              <TerminalLine delay={4.2} text="Review complete. Report generated ✨" color="text-primary" />
            </div>
          </div>
          {/* Glow behind terminal */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-r from-primary via-chart-2 to-chart-3 rounded-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

function TerminalLine({ text, color = "text-muted-foreground", delay }: { text: string; color?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${color} ${text === "" ? "h-2" : ""}`}
    >
      {text}
    </motion.div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Detects vulnerabilities, injection risks, and insecure patterns before they reach production.",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: Gauge,
      title: "Performance Review",
      description: "Identifies memory leaks, N+1 queries, unnecessary re-renders, and optimization opportunities.",
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      icon: Eye,
      title: "Code Quality",
      description: "Evaluates readability, maintainability, naming conventions, and adherence to best practices.",
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      icon: Zap,
      title: "Real-Time Progress",
      description: "Watch the AI analyze your code in real-time with Socket.IO powered live status updates.",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track review trends, quality scores, and severity distributions across all your repositories.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Lock,
      title: "Secure by Design",
      description: "Your tokens stay in your browser. No code is stored. Reviews are scoped to your session.",
      color: "text-chart-4",
      bg: "bg-chart-4/10",
    },
  ];

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Features</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-3">
            Everything you need for{" "}
            <span className="gradient-text">smarter reviews</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Comprehensive AI analysis across security, performance, and code quality — delivered in seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm card-hover"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: Code2, title: "Connect", description: "Link your GitHub repo using a Personal Access Token securely.", number: "01" },
    { icon: FileSearch, title: "Select", description: "Pick a commit or pull request to review from the dashboard. MergeMind fetches the diff automatically.", number: "02" },
    { icon: Bot, title: "Analyze", description: "AI processes your code changes in real-time, checking security, performance, and quality.", number: "03" },
    { icon: Activity, title: "Review", description: "Get a detailed report with scores, grades, severity levels, and actionable suggestions.", number: "04" },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-chart-2 uppercase tracking-wider">How It Works</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-3">
            Four steps to{" "}
            <span className="gradient-text-primary">better code</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative inline-flex mb-6">
                <div className="h-20 w-20 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-shadow duration-300">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const techs = [
    { name: "Next.js 16", description: "React framework", icon: "⚡" },
    { name: "TypeScript", description: "Type safety", icon: "🔷" },
    { name: "Gemini AI", description: "Code analysis", icon: "🧠" },
    { name: "Socket.IO", description: "Real-time updates", icon: "🔌" },
    { name: "shadcn/ui", description: "UI components", icon: "🎨" },
    { name: "Recharts", description: "Data visualization", icon: "📊" },
  ];

  return (
    <section id="tech" className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-chart-3 uppercase tracking-wider">Tech Stack</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-3">
            Built with{" "}
            <span className="gradient-text">modern tools</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors"
            >
              <span className="text-2xl">{tech.icon}</span>
              <div>
                <p className="font-semibold text-sm">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <section id="preview" className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Preview</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-3">
            What you&apos;ll{" "}
            <span className="gradient-text">experience</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 overflow-hidden glass"
          >
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Analytics Dashboard</h3>
                  <p className="text-xs text-muted-foreground">Real-time insights</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Reviews", value: "147" },
                  { label: "Avg Score", value: "92" },
                  { label: "Repos", value: "12" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 text-sm text-muted-foreground">
              Track review trends, quality scores, and severity distributions across all your connected repositories with interactive charts.
            </div>
          </motion.div>

          {/* AI Review preview card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border/50 overflow-hidden glass"
          >
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <h3 className="font-bold">AI Review Report</h3>
                  <p className="text-xs text-muted-foreground">Detailed analysis</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Security scan", status: "✓ Passed", color: "text-emerald-500" },
                  { label: "Performance", status: "2 suggestions", color: "text-yellow-500" },
                  { label: "Code quality", status: "Score: 94/100", color: "text-primary" },
                  { label: "Best practices", status: "1 suggestion", color: "text-chart-2" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <span className="text-sm">{item.label}</span>
                    <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 text-sm text-muted-foreground">
              Each review generates an executive summary, severity-rated issue cards with code snippets, and actionable fix suggestions.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-chart-4 uppercase tracking-wider">Architecture</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mt-3">
            How it all{" "}
            <span className="gradient-text-primary">connects</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/50 p-8 glass"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {[
              { icon: Code2, label: "GitHub", sub: "Repos & PRs" },
              { icon: Terminal, label: "MergeMind API", sub: "Node.js + Express" },
              { icon: Cpu, label: "Gemini AI", sub: "Code Analysis" },
              { icon: BarChart3, label: "Dashboard", sub: "Next.js Frontend" },
            ].map((node, i) => (
              <div key={node.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">
                    <node.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-bold text-sm mt-3">{node.label}</p>
                  <p className="text-xs text-muted-foreground">{node.sub}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex items-center">
                    <div className="w-12 h-px bg-gradient-to-r from-primary/50 to-chart-2/50" />
                    <ChevronRight className="h-4 w-4 text-muted-foreground -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
          Ready to upgrade your{" "}
          <span className="gradient-text">code reviews?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Connect your GitHub repositories, run your first AI-powered code review, and see the difference in minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className={buttonVariants({ size: "lg", className: "h-14 px-10 text-base shadow-xl shadow-primary/25 hover-glow" })}>
            Get Started — Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-10 text-base" })}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            <Code className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">MergeMind AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with Next.js, Gemini AI, and Socket.IO
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/register" className="hover:text-foreground transition-colors">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <PreviewSection />
      <ArchitectureSection />
      <CTASection />
      <Footer />
    </div>
  );
}
