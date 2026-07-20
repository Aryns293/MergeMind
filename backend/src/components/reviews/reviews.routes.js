import { Router } from 'express';
import { initiateReview, getReviewDetails, getRepoReviews } from './reviews.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { initiateReviewSchema, getReviewSchema, getRepoReviewsSchema } from './reviews.validator.js';

const router = Router();

// All review routes are protected
router.use(protect);

// POST /api/reviews - Initiate a new code review
router.post(
  '/',
  validate(initiateReviewSchema),
  initiateReview
);

// GET /api/reviews/:id - Get specific review details
router.get(
  '/:id',
  validate(getReviewSchema),
  getReviewDetails
);

// GET /api/reviews/repo/:repoId - Get all reviews for a repository
router.get(
  '/repo/:repoId',
  validate(getRepoReviewsSchema),
  getRepoReviews
);

export default router;
