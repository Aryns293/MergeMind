import { z } from 'zod';

export const aiReviewSchema = z.object({
  summary: z.string(),
  overallScore: z.number().min(0).max(100),
  grade: z.string(),
  statistics: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
    info: z.number(),
    total: z.number(),
  }),
  comments: z.array(
    z.object({
      filePath: z.string(),
      lineNumber: z.number().nullable().optional(),
      category: z.enum([
        'Security', 'Performance', 'Bug', 'Readability', 'Maintainability',
        'Best_Practice', 'Code_Style', 'Scalability', 'Reliability', 'Documentation'
      ]),
      title: z.string(),
      comment: z.string(),
      suggestion: z.string(),
      codeSnippet: z.string().nullable().optional(),
      severity: z.enum(['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      confidence: z.number().min(0.0).max(1.0).optional()
    })
  )
});
