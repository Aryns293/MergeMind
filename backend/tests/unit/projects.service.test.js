import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectsService from '../../src/components/projects/projects.service.js';
import * as projectRepository from '../../src/repositories/project.repository.js';
import githubClient from '../../src/modules/github/github.client.js';
import AppError from '../../src/utils/appError.js';

// Mock dependencies
vi.mock('../../src/repositories/project.repository.js');
vi.mock('../../src/modules/github/github.client.js');

describe('Projects Service', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('connectRepository', () => {
    it('should successfully connect a public repository without a token', async () => {
      // Arrange
      const mockRepoData = {
        id: 123456,
        name: 'express',
        full_name: 'expressjs/express',
        default_branch: 'master',
      };
      
      githubClient.getRepository.mockResolvedValue(mockRepoData);
      
      const expectedProject = {
        id: 'project-123',
        name: 'express',
        userId: mockUserId,
        repositories: [{ githubRepoId: '123456', fullName: 'expressjs/express' }]
      };
      projectRepository.createProjectWithConnection.mockResolvedValue(expectedProject);

      // Act
      const result = await projectsService.connectRepository(mockUserId, 'expressjs', 'express');

      // Assert
      expect(githubClient.getRepository).toHaveBeenCalledWith(
        process.env.GITHUB_ACCESS_TOKEN,
        'expressjs',
        'express'
      );
      expect(projectRepository.createProjectWithConnection).toHaveBeenCalledWith(
        mockUserId,
        'express',
        '123456',
        'expressjs/express',
        'master'
      );
      expect(result).toEqual(expectedProject);
    });

    it('should throw AppError 404 if repository is not found', async () => {
      // Arrange
      githubClient.getRepository.mockResolvedValue(null);

      // Act & Assert
      await expect(
        projectsService.connectRepository(mockUserId, 'invalidOwner', 'invalidRepo')
      ).rejects.toThrow(AppError);
    });
  });

  describe('listUserProjects', () => {
    it('should return a list of projects for the user', async () => {
      // Arrange
      const mockProjects = [{ id: '1', name: 'Proj1' }, { id: '2', name: 'Proj2' }];
      projectRepository.getProjectsByUser.mockResolvedValue(mockProjects);

      // Act
      const result = await projectsService.listUserProjects(mockUserId);

      // Assert
      expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockProjects);
    });
  });
});
