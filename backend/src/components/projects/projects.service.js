import * as projectRepository from '../../repositories/project.repository.js';
import AppError from '../../utils/appError.js';
import githubClient from '../../modules/github/github.client.js';
import { env } from '../../config/env.js';

export const listUserProjects = async (userId) => {
  return await projectRepository.getProjectsByUser(userId);
};

export const connectRepository = async (userId, repoOwner, repoName, customProjectName) => {
  // Use the system PAT for now since full OAuth isn't linked for the user
  const token = process.env.GITHUB_ACCESS_TOKEN;


  // 1. Verify the repo exists on GitHub
  const repoData = await githubClient.getRepository(token, repoOwner, repoName);

  if (!repoData) {
    throw new AppError('Repository not found or inaccessible.', 404);
  }

  const projectName = customProjectName || repoData.name;

  // 2. Create the project and repo connection in our database
  // Note: we use repoData.id.toString() because github IDs are integers but we store as string
  const project = await projectRepository.createProjectWithConnection(
    userId,
    projectName,
    repoData.id.toString(),
    repoData.full_name,
    repoData.default_branch
  );

  return project;
};

export const getProjectDetails = async (userId, projectId) => {
  const project = await projectRepository.getProjectById(userId, projectId);

  if (!project) {
    throw new AppError('Project not found or you do not have permission', 404);
  }

  return project;
};
