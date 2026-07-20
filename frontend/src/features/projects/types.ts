export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  repositories?: Repository[];
}

export interface Repository {
  id: string;
  projectId: string;
  githubRepoId: string;
  fullName: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  repositoryId: string;
  targetId: string;
  targetType: "COMMIT" | "PR";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  overallScore?: number;
  grade?: string;
  summary?: string;
  aiHistory?: {
    promptTokens: number;
    completionTokens: number;
    modelUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}
