import api from '@/services/api';
import { RemoteRepo, ConnectRepoPayload, GithubCommit, GithubBranch, GithubPullRequest } from './types';

export const githubService = {
  listRemoteRepos: async (token: string): Promise<RemoteRepo[]> => {
    const { data } = await api.get(`/github/remote-repos`, {
      params: { token }
    });
    return data.data.repos;
  },

  connectRepo: async (payload: ConnectRepoPayload): Promise<any> => {
    const { data } = await api.post(`/github/connect`, payload);
    return data.data.connection;
  },

  getCommits: async (connectionId: string, token: string): Promise<GithubCommit[]> => {
    const { data } = await api.get(`/github/${connectionId}/commits`, {
      params: { token }
    });
    return data.data.commits.map((c: any) => ({
      sha: c.sha,
      message: c.commit?.message || '',
      author: c.commit?.author?.name || c.commit?.committer?.name || 'Unknown',
      date: c.commit?.author?.date || c.commit?.committer?.date || new Date().toISOString(),
      url: c.html_url
    }));
  },

  getBranches: async (connectionId: string, token: string): Promise<GithubBranch[]> => {
    const { data } = await api.get(`/github/${connectionId}/branches`, {
      params: { token }
    });
    return data.data.branches.map((b: any) => ({
      name: b.name,
      commitSha: b.commit?.sha || ''
    }));
  },

  getPullRequests: async (connectionId: string, token: string): Promise<GithubPullRequest[]> => {
    const { data } = await api.get(`/github/${connectionId}/pulls`, {
      params: { token }
    });
    return data.data.pullRequests.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      htmlUrl: pr.html_url,
      user: pr.user?.login || 'Unknown',
      createdAt: pr.created_at || new Date().toISOString()
    }));
  }
};
