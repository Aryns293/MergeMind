import { z } from 'zod';
const createProjectSchema = z.object({
  body: z.object({
    projectName: z.string({ required_error: 'Project name is required' }).min(1, 'Project name is required'),
    repoOwner: z.string().optional(),
    repoName: z.string().optional(),
    personalAccessToken: z.string().optional(),
  }).superRefine((data, ctx) => {
    const hasRepoFields = Boolean(data.repoOwner || data.repoName);
    if (hasRepoFields && (!data.repoOwner || !data.repoName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both repository owner and name are required when connecting a repository',
        path: ['repoOwner'],
      });
    }
    if (hasRepoFields && !data.personalAccessToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'GitHub Personal Access Token is required when connecting a repository',
        path: ['personalAccessToken'],
      });
    }
  }),
});

try {
  createProjectSchema.parse({
    body: {
      projectName: "Test Project"
    }
  });
  console.log("Validation passed for just projectName");
} catch (err) {
  console.log("Validation failed", err.errors);
}
