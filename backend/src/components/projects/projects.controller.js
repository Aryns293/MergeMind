import * as projectsService from './projects.service.js';

export const getProjects = async (req, res) => {
  const userId = req.user.id;
  const projects = await projectsService.listUserProjects(userId);

  res.status(200).json({
    status: 'success',
    data: { projects }
  });
};

export const createProject = async (req, res) => {
  const userId = req.user.id;
  const { repoOwner, repoName, projectName, personalAccessToken } = req.body;

  const project = await projectsService.createProject(userId, {
    projectName,
    repoOwner,
    repoName,
    personalAccessToken,
  });

  res.status(201).json({
    status: 'success',
    data: { project }
  });
};

export const getProjectById = async (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.id;

  const project = await projectsService.getProjectDetails(userId, projectId);

  res.status(200).json({
    status: 'success',
    data: { project }
  });
};
