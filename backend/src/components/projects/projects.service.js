import * as projectRepository from '../../repositories/project.repository.js';
import AppError from '../../utils/appError.js';
import githubClient from '../../modules/github/github.client.js';

export const listUserProjects = async (userId) => {
  return await projectRepository.getProjectsByUser(userId);
};

export const createEmptyProject = async (userId, projectName) => {
  if (!projectName?.trim()) {
    throw new AppError('Project name is required', 400);
  }
  return await projectRepository.createProject(userId, projectName.trim());
};

export const connectRepository = async (userId, repoOwner, repoName, customProjectName, personalAccessToken) => {
  if (!personalAccessToken) {
    throw new AppError('GitHub Personal Access Token is required', 400);
  }

  const repoData = await githubClient.getRepository(personalAccessToken, repoOwner, repoName);

  if (!repoData) {
    throw new AppError('Repository not found or inaccessible.', 404);
  }

  const projectName = customProjectName || repoData.name;

  const project = await projectRepository.createProjectWithConnection(
    userId,
    projectName,
    repoData.id.toString(),
    repoData.full_name,
    repoData.default_branch
  );

  return project;
};

export const createProject = async (userId, { projectName, repoOwner, repoName, personalAccessToken }) => {
  if (repoOwner && repoName) {
    return connectRepository(userId, repoOwner, repoName, projectName, personalAccessToken);
  }

  return createEmptyProject(userId, projectName);
};

export const getProjectDetails = async (userId, projectId) => {
  const project = await projectRepository.getProjectById(userId, projectId);

  if (!project) {
    throw new AppError('Project not found or you do not have permission', 404);
  }

  return project;
};
