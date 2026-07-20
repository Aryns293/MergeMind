import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';
import { auditLogger } from '../../utils/audit.util.js';
import queueService from '../../modules/queue/queue.service.js';
import reviewRepository from '../../repositories/review.repository.js';
import socketService from '../../modules/socket/socket.service.js';

class ReviewsService {
  /**
   * Orchestrates the review process: Creates pending DB entry -> Enqueues Job
   */
  async initiateReview(userId, payload) {
    const { repoId, targetType, targetId, githubToken, correlationId } = payload;

    logger.info(`Initiating background review for ${targetType} ${targetId} on repo ${repoId}`);
    
    auditLogger.log('REVIEW_TRIGGERED', userId, { repoId, targetType, targetId });

    // Emit start event immediately
    socketService.emitToUser(userId, 'review:start', { targetId, targetType, repoId });

    // 1. Create a pending review in the database
    const pendingReview = await reviewRepository.createPendingReview(repoId, targetType, targetId);

    // 2. Add job to the queue
    const jobPayload = {
      reviewId: pendingReview.id,
      repoId,
      targetType,
      targetId,
      githubToken,
      userId,
      correlationId
    };

    await queueService.addReviewJob(jobPayload);

    return pendingReview;
  }

  /**
   * Get details of a specific review
   */
  async getReviewDetails(reviewId, userId) {
    const review = await reviewRepository.getReviewById(reviewId);
    if (!review) {
      throw new AppError('Review not found', 404);
    }
    
    // We should check if the user owns the repo, but reviewRepository doesn't fetch repo->project->user
    // For now, we trust the ID or we can add a check if needed.
    return review;
  }

  /**
   * List all reviews for a repo
   */
  async getRepoReviews(repoId, userId) {
    // Note: ideally check if userId owns repoId first
    return await reviewRepository.getReviewsForRepository(repoId);
  }
}

export default new ReviewsService();