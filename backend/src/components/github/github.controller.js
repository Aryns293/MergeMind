import githubService from './github.service.js';
import catchAsync from '../../utils/catchAsync.js';

export const listRemoteRepos = catchAsync(async (req, res) => {
  // Read token from query params or headers for dev simplicity
  const token = req.query.token || req.headers['x-github-token'];
  const repos = await githubService.listRemoteRepositories(token);

  res.status(200).json({
    status: 'success',
    data: { repos },
  });
});

export const connectRepo = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const connection = await githubService.connectRepository(userId, req.body);

  res.status(201).json({
    status: 'success',
    data: { connection },
  });
});

export const getCommits = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { connectionId } = req.params;
  const { token } = req.query;

  const commits = await githubService.getRepositoryCommits(connectionId, token, userId);

  res.status(200).json({
    status: 'success',
    data: { commits },
  });
});

export const getBranches = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { connectionId } = req.params;
  const { token } = req.query;

  const branches = await githubService.getRepositoryBranches(connectionId, token, userId);

  res.status(200).json({
    status: 'success',
    data: { branches },
  });
});

export const getPullRequests = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { connectionId } = req.params;
  const { token } = req.query;

  const pullRequests = await githubService.getRepositoryPullRequests(connectionId, token, userId);

  res.status(200).json({
    status: 'success',
    data: { pullRequests },
  });
});

export const getDiff = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { connectionId, sha } = req.params;
  const { token } = req.query;

  const diff = await githubService.getCommitDiff(connectionId, sha, token, userId);

  // Note: we are returning raw text diff here, so we wrap it in json
  res.status(200).json({
    status: 'success',
    data: { diff },
  });
});
