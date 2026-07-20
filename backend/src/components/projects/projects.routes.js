import { Router } from 'express';
import * as projectsController from './projects.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { createProjectSchema } from './projects.validator.js';
import catchAsync from '../../utils/catchAsync.js';

const router = Router();

// Protect all project routes
router.use(protect);

router.get('/', catchAsync(projectsController.getProjects));
router.post('/', validate(createProjectSchema), catchAsync(projectsController.createProject));
router.get('/:id', catchAsync(projectsController.getProjectById));

export default router;
