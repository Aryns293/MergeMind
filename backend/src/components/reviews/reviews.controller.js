import reviewsService from './reviews.service.js';
import catchAsync from '../../utils/catchAsync.js';

/**
 * Initiates a new AI code review
 */
export const initiateReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const payload = { ...req.body, correlationId: req.headers['x-request-id'] };

  const review = await reviewsService.initiateReview(userId, payload);

  res.status(202).json({
    status: 'success',
    message: 'Review job accepted and processing in background',
    data: review
  });
});

/**
 * Gets a specific review's details
 */
export const getReviewDetails = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const reviewId = req.params.id;

  const review = await reviewsService.getReviewDetails(reviewId, userId);

  res.status(200).json({
    status: 'success',
    message: 'Review fetched successfully',
    data: review
  });
});

/**
 * Gets all reviews for a repository
 */
export const getRepoReviews = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const repoId = req.params.repoId;

  const reviews = await reviewsService.getRepoReviews(repoId, userId);

  res.status(200).json({
    status: 'success',
    message: 'Repository reviews fetched successfully',
    data: reviews
  });
});
