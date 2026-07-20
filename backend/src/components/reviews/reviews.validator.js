import { z } from 'zod';

// POST /api/reviews
export const initiateReviewSchema = z.object({
  body: z.object({
    repoId: z.string().uuid({ message: 'Invalid repoId format' }),
    targetType: z.enum(['COMMIT', 'PR'], { message: 'targetType must be COMMIT or PR' }),
    targetId: z.string().min(1, { message: 'targetId (e.g. commit SHA) is required' }),
    githubToken: z.string().min(1, { message: 'githubToken is required' }),
  })
});

// GET /api/reviews/:id
export const getReviewSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid review ID format' }),
  })
});

// GET /api/reviews/repo/:repoId
export const getRepoReviewsSchema = z.object({
  params: z.object({
    repoId: z.string().uuid({ message: 'Invalid repoId format' }),
  })
});
