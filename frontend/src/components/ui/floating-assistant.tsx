"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Info } from "lucide-react";
import { Button } from "./button";
import { BorderBeam } from "@/components/magicui/border-beam";

export function FloatingAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [contextMessage, setContextMessage] = useState("");

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem('mergemind_ai_assistant_open');
    if (savedState === 'true') setIsOpen(true);
  }, []);

  const toggleOpen = () => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem('mergemind_ai_assistant_open', next.toString());
      return next;
    });
  };

  // Contextual messages based on pathname
  useEffect(() => {
    let contextMessage = "Hi! I'm your MergeMind AI assistant. How can I help you with your code reviews today?";
    
    if (pathname === '/dashboard') {
      contextMessage = "Welcome to your Dashboard! Here you can track your total projects, connected repositories, and review metrics. The Activity chart shows your recent code reviews.";
    } else if (pathname?.startsWith('/reviews/') && pathname !== '/reviews') {
      contextMessage = "This is a detailed Review Report. The overall grade is calculated from code quality, security, and performance metrics. You can filter the comments below by severity.";
    } else if (pathname === '/reviews') {
      contextMessage = "This is your Review History. You can see all past AI code reviews and filter them by grade or status.";
    } else if (pathname?.startsWith('/repositories')) {
      contextMessage = "On the Repositories page, you can connect new GitHub repos and see your branches and pull requests. Click 'Review Now' to start a real-time AI code analysis.";
    } else if (pathname === '/reports') {
      contextMessage = "The Reports page visualizes your code quality trends. Pay attention to the most common issue severities to improve your team's overall score.";
    } else if (pathname === '/settings') {
      contextMessage = "Manage your preferences and API token here. Remember, your GitHub token requires the 'repo' scope and is stored securely in your local browser.";
    }

    setContextMessage(contextMessage);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden flex flex-col"
          >
            <BorderBeam size={200} duration={10} delay={0} />
            
            {/* Header */}
            <div className="bg-black/30 p-4 border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-none tracking-tight">MergeMind AI</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Page Guide</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-white/10" 
                onClick={toggleOpen}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content Area */}
            <div className="p-6 relative z-10 bg-background/20 backdrop-blur-sm">
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm leading-relaxed text-foreground shadow-inner">
                {contextMessage}
              </div>
              
              <Button 
                onClick={toggleOpen}
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 h-11 rounded-xl"
              >
                Got it
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={toggleOpen}
          className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen 
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary border border-white/10' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 border border-primary/20'
          }`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Info className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  );
}
