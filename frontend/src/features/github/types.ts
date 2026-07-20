export interface RemoteRepo {
  id: string; // GitHub Repo ID
  name: string;
  fullName: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
}

export interface ConnectRepoPayload {
  projectId: string;
  githubRepoId: string;
  fullName: string;
  defaultBranch: string;
  personalAccessToken: string;
}

export interface GithubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GithubBranch {
  name: string;
  commitSha: string;
}

export interface GithubPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  htmlUrl: string;
  user: string;
  createdAt: string;
}
