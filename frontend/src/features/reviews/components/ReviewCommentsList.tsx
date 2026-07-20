import React, { useState } from 'react';
import { ReviewComment } from '../types';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FileCode, AlertTriangle, ShieldAlert, CheckCircle, Info, LayoutTemplate, Activity, FileText, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewCommentsListProps {
  comments: ReviewComment[];
}

export function ReviewCommentsList({ comments }: ReviewCommentsListProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const { theme } = useTheme();

  const filteredComments = filterSeverity === 'ALL' 
    ? comments 
    : comments.filter(c => c.severity === filterSeverity);

  const toggleExpand = (id: string) => {
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <ShieldAlert className="h-5 w-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />;
      case 'MEDIUM': return <AlertTriangle className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />;
      case 'LOW': return <Info className="h-5 w-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />;
      case 'INFO': return <CheckCircle className="h-5 w-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'HIGH': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'INFO': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security': return <ShieldAlert className="h-3 w-3" />;
      case 'Performance': return <Activity className="h-3 w-3" />;
      case 'Bug': return <AlertTriangle className="h-3 w-3" />;
      case 'Code_Style': return <LayoutTemplate className="h-3 w-3" />;
      case 'Documentation': return <FileText className="h-3 w-3" />;
      default: return <FileCode className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => (
          <Badge 
            key={sev}
            variant="outline"
            className={`cursor-pointer whitespace-nowrap transition-all duration-300 ${
              filterSeverity === sev 
                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.5)] border-primary' 
                : 'hover:bg-primary/10 hover:border-primary/30'
            }`}
            onClick={() => setFilterSeverity(sev)}
          >
            {sev === 'ALL' ? 'All Issues' : sev}
            <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
              filterSeverity === sev ? 'bg-black/20' : 'bg-muted-foreground/20'
            }`}>
              {sev === 'ALL' ? comments.length : comments.filter(c => c.severity === sev).length}
            </span>
          </Badge>
        ))}
      </div>

      {filteredComments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 border-2 border-dashed border-white/10 rounded-xl bg-background/30 backdrop-blur-sm text-muted-foreground"
        >
          <CheckCircle className="h-12 w-12 text-green-500/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">All Clear</h3>
          <p>No issues found for this filter combination.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredComments.map((comment, index) => {
              const isExpanded = expandedComments[comment.id] || false;
              
              return (
                <motion.div 
                  key={comment.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border border-white/10 rounded-xl bg-background/50 backdrop-blur-md overflow-hidden shadow-sm transition-all hover:border-white/20 hover:shadow-md"
                >
                  <div 
                    className="p-4 bg-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => toggleExpand(comment.id)}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getSeverityIcon(comment.severity)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-base pr-4 leading-tight">{comment.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5 font-mono">
                            <FileCode className="h-3 w-3" />
                            {comment.filePath}
                          </span>
                          {comment.lineNumber && (
                            <span className="bg-black/30 px-2 py-1 rounded-md border border-white/5 font-mono">
                              Line {comment.lineNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                      <Badge variant="outline" className="flex items-center gap-1.5 border-white/10 bg-black/20">
                        {getCategoryIcon(comment.category)}
                        {comment.category.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={`${getSeverityBadgeColor(comment.severity)} uppercase font-bold tracking-wider text-[10px]`}>
                        {comment.severity}
                      </Badge>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 space-y-5 border-t border-white/5 bg-black/20">
                          <div className="text-sm text-gray-300 leading-relaxed">
                            {comment.comment}
                          </div>
                          
                          {comment.codeSnippet && (
                            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                              <div className="bg-[#1e1e1e] px-4 py-2 text-xs font-mono border-b border-white/10 text-gray-400 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                  <FileCode className="h-3 w-3" /> Problematic Code
                                </span>
                              </div>
                              <SyntaxHighlighter 
                                language="typescript" 
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, padding: '1rem', borderRadius: 0, fontSize: '0.85rem', backgroundColor: '#1e1e1e' }}
                              >
                                {comment.codeSnippet}
                              </SyntaxHighlighter>
                            </div>
                          )}
          
                          {comment.suggestion && (
                            <div className="relative overflow-hidden bg-primary/5 border border-primary/20 p-5 rounded-xl">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                              <h5 className="text-sm font-semibold mb-2 text-primary flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" /> Recommended Fix
                              </h5>
                              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {comment.suggestion}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
