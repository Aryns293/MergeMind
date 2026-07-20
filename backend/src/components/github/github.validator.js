import { z } from 'zod';

export const connectRepoSchema = z.object({
  body: z.object({
    projectId: z.string().uuid('Invalid project ID'),
    githubRepoId: z.string().min(1, 'GitHub Repo ID is required'),
    fullName: z.string().min(1, 'Repository full name is required'),
    defaultBranch: z.string().optional(),
    personalAccessToken: z.string().min(1, 'GitHub Personal Access Token is required for connection'),
  }),
});

export const connectionIdParamSchema = z.object({
  params: z.object({
    connectionId: z.string().uuid('Invalid connection ID'),
  }),
  query: z.object({
    token: z.string().min(1, 'GitHub token must be provided via query for this milestone'), // In a fully baked OAuth flow, token is fetched from DB. Passing via query/header for dev flexibility.
  }),
});

export const diffParamSchema = z.object({
  params: z.object({
    connectionId: z.string().uuid('Invalid connection ID'),
    sha: z.string().min(1, 'Commit SHA is required'),
  }),
  query: z.object({
    token: z.string().min(1, 'GitHub token must be provided via query'),
  }),
});
