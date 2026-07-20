import express from 'express';
import {
  listRemoteRepos,
  connectRepo,
  getCommits,
  getBranches,
  getPullRequests,
  getDiff
} from './github.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { connectRepoSchema, connectionIdParamSchema, diffParamSchema } from './github.validator.js';

const router = express.Router();

// All github routes require authentication
router.use(protect);

router.get('/remote-repos', listRemoteRepos);
router.post('/connect', validate(connectRepoSchema), connectRepo);

router.get('/:connectionId/commits', validate(connectionIdParamSchema), getCommits);
router.get('/:connectionId/branches', validate(connectionIdParamSchema), getBranches);
router.get('/:connectionId/pulls', validate(connectionIdParamSchema), getPullRequests);
router.get('/:connectionId/diff/:sha', validate(diffParamSchema), getDiff);

export default router;
