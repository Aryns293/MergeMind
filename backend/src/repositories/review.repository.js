import prisma from '../config/prisma.js';

class ReviewRepository {
  /**
   * Creates a pending Review entry
   */
  async createPendingReview(repoId, targetType, targetId) {
    return prisma.review.create({
      data: {
        repoId,
        targetType,
        targetId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Updates the status of a review
   */
  async updateReviewStatus(reviewId, status) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });
  }

  /**
   * Updates an existing review with comments and AI history atomically.
   */
  async updateReviewWithComments(reviewId, aiResult) {
    return prisma.$transaction(async (tx) => {
      // 1. Update the base Review status and save new metadata fields
      const review = await tx.review.update({
        where: { id: reviewId },
        data: { 
          status: 'COMPLETED',
          summary: aiResult.summary,
          overallScore: aiResult.overallScore,
          grade: aiResult.grade,
        },
      });

      // 2. Prepare Comments data
      if (aiResult.comments && aiResult.comments.length > 0) {
        const commentsData = aiResult.comments.map((comment) => ({
          reviewId: review.id,
          filePath: comment.filePath,
          lineNumber: comment.lineNumber || null,
          category: comment.category,
          title: comment.title,
          comment: comment.comment,
          suggestion: comment.suggestion,
          codeSnippet: comment.codeSnippet || null,
          severity: comment.severity,
          confidence: comment.confidence || null,
        }));

        await tx.reviewComment.createMany({
          data: commentsData,
        });
      }

      // 3. Save AI History
      await tx.aiReviewHistory.create({
        data: {
          reviewId: review.id,
          promptTokens: aiResult.usage.promptTokens,
          completionTokens: aiResult.usage.completionTokens,
          modelUsed: aiResult.usage.modelUsed,
          rawResponse: aiResult.usage.rawResponse,
        },
      });

      return review;
    });
  }

  /**
   * Fetches a single review by ID with all its nested comments and AI history
   */
  async getReviewById(reviewId) {
    return prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        comments: true,
        aiHistory: true,
      },
    });
  }

  /**
   * Fetches all reviews for a given repository
   */
  async getReviewsForRepository(repoId, skip = 0, take = 20) {
    return prisma.review.findMany({
      where: { repoId },
      skip,
      take,
      include: {
        comments: {
          select: { id: true, category: true, title: true, severity: true, filePath: true, lineNumber: true } // Limit payload size
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export default new ReviewRepository();
