import githubService from '../../components/github/github.service.js';
import aiService from '../../modules/ai/ai.service.js';
import reviewRepository from '../../repositories/review.repository.js';
import socketService from '../../modules/socket/socket.service.js';
import logger from '../../utils/logger.js';



/**
 * Background worker to process code reviews
 */
export const processReviewJob = async (jobData) => {
  const { reviewId, repoId, targetType, targetId, githubToken, userId, correlationId } = jobData;
  const childLogger = logger.child({ correlationId, reviewId });

  try {
    childLogger.info(`Starting background review process`);
    
    // 1. Fetch the raw diff from GitHub
    socketService.emitToUser(userId, 'review:progress', { message: 'Fetching diff from GitHub...' });
    
    let diff;
    if (targetType === 'COMMIT') {
      diff = await githubService.getCommitDiff(repoId, targetId, githubToken, userId);
    } else {
      throw new Error('PR reviews are not fully implemented yet');
    }

    if (!diff) {
      throw new Error('The requested diff is empty or does not exist.');
    }

    if (diff.length > 1000000) { 
      throw new Error('The diff is too large for AI review. Please break it down.');
    }

    // 2. Call AI Service with the full diff
    socketService.emitToUser(userId, 'review:progress', { message: 'Analyzing code with AI...' });
    
    const aiResult = await aiService.generateCodeReview(diff);

    // 3. Aggregate Results
    const aggregatedResult = {
      summary: aiResult.summary,
      overallScore: aiResult.overallScore,
      grade: 'A', // Will calculate below
      comments: aiResult.comments,
      usage: {
        promptTokens: aiResult.usage.promptTokens,
        completionTokens: aiResult.usage.completionTokens,
        modelUsed: 'gemini-1.5-flash',
        rawResponse: [aiResult.usage?.rawResponse || '']
      }
    };

    // Calculate Grade based on aggregated score
    if (aggregatedResult.overallScore >= 90) aggregatedResult.grade = 'A';
    else if (aggregatedResult.overallScore >= 80) aggregatedResult.grade = 'B';
    else if (aggregatedResult.overallScore >= 70) aggregatedResult.grade = 'C';
    else if (aggregatedResult.overallScore >= 60) aggregatedResult.grade = 'D';
    else aggregatedResult.grade = 'F';

    // 4. Save the results to the database atomically (Update existing pending review)
    socketService.emitToUser(userId, 'review:progress', { message: 'Saving results to database...' });
    
    await reviewRepository.updateReviewWithComments(reviewId, aggregatedResult);

    // Fetch and return the fully populated review to emit to user
    const finalReview = await reviewRepository.getReviewById(reviewId);
    
    childLogger.info(`Successfully processed review`);
    socketService.emitToUser(userId, 'review:complete', finalReview);
    
    return { success: true, reviewId };
  } catch (error) {
    childLogger.error(error, `Failed to process review job`);
    
    // Mark the review as FAILED in the DB
    await reviewRepository.updateReviewStatus(reviewId, 'FAILED');
    
    // Notify the user via socket
    socketService.emitToUser(userId, 'review:error', { message: `Review processing failed: ${error.message}` });
    
    // Throw error so PgBoss knows the job failed and can retry if applicable
    throw error;
  }
};
