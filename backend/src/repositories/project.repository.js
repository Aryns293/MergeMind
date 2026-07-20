import prisma from '../config/prisma.js';

export const createProject = async (userId, name) => {
  return prisma.project.create({
    data: {
      userId,
      name,
    },
  });
};

export const getProjectsByUser = async (userId, skip = 0, take = 50) => {
  return prisma.project.findMany({
    where: { userId },
    skip,
    take,
    include: {
      repositories: {
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
            include: { aiHistory: true }
          }
        }
      },
    },
  });
};

export const createProjectWithConnection = async (userId, name, githubRepoId, fullName, defaultBranch) => {
  return prisma.project.create({
    data: {
      userId,
      name,
      repositories: {
        create: {
          githubRepoId,
          fullName,
          defaultBranch
        }
      }
    },
    include: {
      repositories: true
    }
  });
};

export const getProjectById = async (userId, projectId) => {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId
    },
    include: {
      repositories: {
        include: {
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  });
};
