import prisma from '../config/prisma.js';

class RepositoryConnectionRepository {
  async createConnection(data) {
    return prisma.repositoryConnection.create({
      data,
    });
  }

  async getConnectionById(id) {
    return prisma.repositoryConnection.findUnique({
      where: { id },
      include: { project: true },
    });
  }

  async getConnectionByGithubRepoId(projectId, githubRepoId) {
    return prisma.repositoryConnection.findUnique({
      where: {
        projectId_githubRepoId: {
          projectId,
          githubRepoId: githubRepoId.toString(),
        },
      },
    });
  }

  async getUserConnections(userId) {
    return prisma.repositoryConnection.findMany({
      where: {
        project: { userId },
      },
      include: {
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteConnection(id) {
    return prisma.repositoryConnection.delete({
      where: { id },
    });
  }
}

export default new RepositoryConnectionRepository();
