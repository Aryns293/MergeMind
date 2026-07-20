export interface ReviewComment {
  id: string;
  reviewId: string;
  filePath: string;
  lineNumber?: number;
  category: string;
  title: string;
  comment: string;
  suggestion: string;
  codeSnippet?: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence?: number;
  createdAt: string;
}

export interface ReviewResponse {
  id: string;
  repoId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  targetType: 'COMMIT' | 'PR';
  targetId: string;
  summary?: string;
  overallScore?: number;
  grade?: string;
  createdAt: string;
  updatedAt: string;
  comments?: ReviewComment[];
}
