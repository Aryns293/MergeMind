import api from '@/services/api';
import { Project } from './types';

export const projectsService = {
  getProjects: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects');
    return data.data.projects;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data.data.project;
  },

  createProject: async (payload: {
    projectName: string;
    repoOwner?: string;
    repoName?: string;
    personalAccessToken?: string;
  }): Promise<Project> => {
    const { data } = await api.post('/projects', payload);
    return data.data.project;
  },
};
