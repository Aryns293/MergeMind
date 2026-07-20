import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    repoOwner: z.string({ required_error: 'Repository owner is required' }).min(1),
    repoName: z.string({ required_error: 'Repository name is required' }).min(1),
    projectName: z.string().optional(),
  }),
});
