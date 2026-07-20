import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as projectsService from '../../src/components/projects/projects.service.js';
import * as projectRepository from '../../src/repositories/project.repository.js';
import githubClient from '../../src/modules/github/github.client.js';
import AppError from '../../src/utils/appError.js';

vi.mock('../../src/repositories/project.repository.js');
vi.mock('../../src/modules/github/github.client.js');

describe('Projects Service', () => {
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockToken = 'ghp_test_token_12345';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createEmptyProject', () => {
    it('should create a project without a repository', async () => {
      const expectedProject = { id: 'project-123', name: 'My App', userId: mockUserId };
      projectRepository.createProject.mockResolvedValue(expectedProject);

      const result = await projectsService.createEmptyProject(mockUserId, 'My App');

      expect(projectRepository.createProject).toHaveBeenCalledWith(mockUserId, 'My App');
      expect(result).toEqual(expectedProject);
    });
  });

  describe('connectRepository', () => {
    it('should successfully connect a repository using the user PAT', async () => {
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

      const result = await projectsService.connectRepository(
        mockUserId,
        'expressjs',
        'express',
        undefined,
        mockToken
      );

      expect(githubClient.getRepository).toHaveBeenCalledWith(mockToken, 'expressjs', 'express');
      expect(projectRepository.createProjectWithConnection).toHaveBeenCalledWith(
        mockUserId,
        'express',
        '123456',
        'expressjs/express',
        'master'
      );
      expect(result).toEqual(expectedProject);
    });

    it('should throw AppError 400 if PAT is missing', async () => {
      await expect(
        projectsService.connectRepository(mockUserId, 'expressjs', 'express')
      ).rejects.toThrow(AppError);
    });

    it('should throw AppError 404 if repository is not found', async () => {
      githubClient.getRepository.mockResolvedValue(null);

      await expect(
        projectsService.connectRepository(mockUserId, 'invalidOwner', 'invalidRepo', undefined, mockToken)
      ).rejects.toThrow(AppError);
    });
  });

  describe('createProject', () => {
    it('should create an empty project when no repo fields are provided', async () => {
      const expectedProject = { id: 'project-123', name: 'My App', userId: mockUserId };
      projectRepository.createProject.mockResolvedValue(expectedProject);

      const result = await projectsService.createProject(mockUserId, { projectName: 'My App' });

      expect(projectRepository.createProject).toHaveBeenCalledWith(mockUserId, 'My App');
      expect(result).toEqual(expectedProject);
    });
  });

  describe('listUserProjects', () => {
    it('should return a list of projects for the user', async () => {
      const mockProjects = [{ id: '1', name: 'Proj1' }, { id: '2', name: 'Proj2' }];
      projectRepository.getProjectsByUser.mockResolvedValue(mockProjects);

      const result = await projectsService.listUserProjects(mockUserId);

      expect(projectRepository.getProjectsByUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockProjects);
    });
  });
});
