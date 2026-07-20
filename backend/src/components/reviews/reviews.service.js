import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';
import { auditLogger } from '../../utils/audit.util.js';
import reviewRepository from '../../repositories/review.repository.js';
import socketService from '../../modules/socket/socket.service.js';
import { processReviewJob } from '../../modules/queue/review.worker.js';
import queueService from '../../modules/queue/queue.service.js';

class ReviewsService {
  /**
   * Orchestrates the review process: Creates pending DB entry -> Processes Job
   * Falls back to direct async processing if queue is unavailable
   */
  async initiateReview(userId, payload) {
    const { repoId, targetType, targetId, githubToken, correlationId } = payload;

    logger.info(`Initiating review for ${targetType} ${targetId} on repo ${repoId}`);
    
    auditLogger.log('REVIEW_TRIGGERED', userId, { repoId, targetType, targetId });

    // Emit start event immediately so UI shows progress
    socketService.emitToUser(userId, 'review:start', { targetId, targetType, repoId });

    // 1. Create a pending review in the database
    const pendingReview = await reviewRepository.createPendingReview(repoId, targetType, targetId);

    const jobPayload = {
      reviewId: pendingReview.id,
      repoId,
      targetType,
      targetId,
      githubToken,
      userId,
      correlationId
    };

    // 2. Try queue first, fall back to direct async processing
    const useQueue = queueService && queueService.boss && queueService.boss.isStarted;
    
    if (useQueue) {
      logger.info('Processing review via pg-boss queue');
      await queueService.addReviewJob(jobPayload);
    } else {
      // Process directly in background (non-blocking - fire and forget)
      logger.info('Queue unavailable - processing review directly in background');
      setImmediate(async () => {
        try {
          await processReviewJob(jobPayload);
        } catch (error) {
          logger.error(error, 'Direct review processing failed');
        }
      });
    }

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
    return review;
  }

  /**
   * List all reviews for a repo
   */
  async getRepoReviews(repoId, userId) {
    return await reviewRepository.getReviewsForRepository(repoId);
  }
}

export default new ReviewsService();