import githubClient from '../../modules/github/github.client.js';
import repositoryConnectionRepository from '../../repositories/repositoryConnection.repository.js';
import AppError from '../../utils/appError.js';
import prisma from '../../config/prisma.js';
import { LRUCache } from 'lru-cache';

// Initialize cache: max 100 items, TTL 60 seconds
const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60,
});

class GitHubService {
  /**
   * List remote repositories available to the user via their PAT
   */
  async listRemoteRepositories(token) {
    if (!token) throw new AppError('GitHub token is required', 400);
    const repos = await githubClient.getRepositories(token);
    
    // Map to a cleaner format
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
      url: repo.html_url,
      defaultBranch: repo.default_branch,
      owner: repo.owner.login
    }));
  }

  /**
   * Save a selected repository connection to the database
   */
  async connectRepository(userId, payload) {
    const { projectId, githubRepoId, fullName, defaultBranch, personalAccessToken } = payload;
    
    // Validate that project belongs to user
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== userId) {
      throw new AppError('Project not found or unauthorized', 404);
    }

    // Verify token can access the requested repo before saving
    const [owner, repoName] = fullName.split('/');
    await githubClient.getRepository(personalAccessToken, owner, repoName);

    // Save connection
    const connection = await repositoryConnectionRepository.createConnection({
      projectId,
      githubRepoId,
      fullName,
      defaultBranch: defaultBranch || 'main',
    });

    return connection;
  }

  /**
   * Fetch commits for a specific connected repository
   */
  async getRepositoryCommits(connectionId, token, userId) {
    const cacheKey = `commits_${connectionId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const connection = await this._getValidatedConnection(connectionId, userId);
    const [owner, repoName] = connection.fullName.split('/');
    
    const commits = await githubClient.getCommits(token, owner, repoName, connection.defaultBranch);
    cache.set(cacheKey, commits);
    return commits;
  }

  /**
   * Fetch branches for a specific connected repository
   */
  async getRepositoryBranches(connectionId, token, userId) {
    const cacheKey = `branches_${connectionId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const connection = await this._getValidatedConnection(connectionId, userId);
    const [owner, repoName] = connection.fullName.split('/');
    
    const branches = await githubClient.getBranches(token, owner, repoName);
    cache.set(cacheKey, branches);
    return branches;
  }

  /**
   * Fetch PRs for a specific connected repository
   */
  async getRepositoryPullRequests(connectionId, token, userId) {
    const cacheKey = `prs_${connectionId}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const connection = await this._getValidatedConnection(connectionId, userId);
    const [owner, repoName] = connection.fullName.split('/');
    
    const prs = await githubClient.getPullRequests(token, owner, repoName);
    cache.set(cacheKey, prs);
    return prs;
  }

  /**
   * Get raw diff of a specific commit
   */
  async getCommitDiff(connectionId, sha, token, userId) {
    // Diffs can be huge, we might not want to cache them in memory, or if we do, use a separate cache
    // For now, we fetch it fresh (diffs are usually only fetched once during review orchestration)
    const connection = await this._getValidatedConnection(connectionId, userId);
    const [owner, repoName] = connection.fullName.split('/');
    
    return await githubClient.getCommitDiff(token, owner, repoName, sha);
  }

  /**
   * Helper: Ensure connection exists and belongs to the user
   */
  async _getValidatedConnection(connectionId, userId) {
    const connection = await repositoryConnectionRepository.getConnectionById(connectionId);
    if (!connection) throw new AppError('Repository connection not found', 404);
    if (connection.project.userId !== userId) {
      throw new AppError('Unauthorized access to this repository connection', 403);
    }
    return connection;
  }
}

export default new GitHubService();
