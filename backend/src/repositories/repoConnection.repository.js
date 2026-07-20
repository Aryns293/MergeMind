import prisma from '../config/prisma.js';

export const linkRepository = async (projectId, githubRepoId, fullName, defaultBranch) => {
  return prisma.repositoryConnection.create({
    data: {
      projectId,
      githubRepoId,
      fullName,
      defaultBranch,
    },
  });
};

export const getRepositoriesByProject = async (projectId) => {
  return prisma.repositoryConnection.findMany({
    where: { projectId },
  });
};

export const findRepositoryByFullName = async (projectId, fullName) => {
  return prisma.repositoryConnection.findFirst({
    where: {
      projectId,
      fullName,
    },
  });
};
