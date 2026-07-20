import geminiProvider from './providers/gemini.provider.js';
import { buildReviewPrompt } from './prompts/review.prompt.js';
import { aiReviewSchema } from './ai.validator.js';
import { env } from '../../config/env.js';
import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';
import { measureLatency } from '../../utils/performance.util.js';

class AIService {
  /**
   * Cleans potential markdown formatting from AI JSON responses
   */
  _cleanJsonResponse(rawText) {
    let cleanText = rawText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    return cleanText.trim();
  }

  /**
   * Generates a code review with automatic retries and JSON validation
   * @param {string} diff - The git diff to review
   * @param {number} maxRetries - Maximum number of retries if AI fails or hallucinates
   */
  async generateCodeReview(diff, maxRetries = 2) {
    const prompt = buildReviewPrompt(diff);
    let attempt = 0;
    let lastError = null;

    while (attempt <= maxRetries) {
      try {
        logger.info(`AI Review Attempt ${attempt + 1}/${maxRetries + 1}`);
        
        // 1. Call the AI Provider
        const { rawResponse, promptTokens, completionTokens } = await measureLatency('AI_API_GEMINI', async () => {
          return await geminiProvider.generateReview(prompt);
        });
        
        // 2. Clean the string
        const jsonString = this._cleanJsonResponse(rawResponse);
        
        // 3. Parse JSON
        let parsedData;
        try {
          parsedData = JSON.parse(jsonString);
        } catch (parseError) {
          throw new AppError(`AI returned malformed JSON: ${jsonString.substring(0, 50)}...`, 502);
        }

        // 4. Validate against Schema
        const validation = aiReviewSchema.safeParse(parsedData);
        if (!validation.success) {
          throw new AppError(`AI JSON schema mismatch: ${validation.error.message}`, 502);
        }

        // Success!
        return {
          ...validation.data,
          usage: {
            promptTokens,
            completionTokens,
            modelUsed: 'gemini-2.5-flash',
            rawResponse: parsedData // Storing the clean parsed object
          }
        };

      } catch (error) {
        lastError = error;
        logger.warn(`AI Review Attempt ${attempt + 1} failed: ${error.message}`);
        attempt++;
      }
    }

    // Exhausted retries
    logger.error(`AI Review failed after ${maxRetries + 1} attempts.`);
    throw new AppError(`Failed to generate valid AI code review: ${lastError.message}`, 502);
  }
}

export default new AIService();
