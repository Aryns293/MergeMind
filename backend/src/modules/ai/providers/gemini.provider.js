import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../config/env.js';
import AppError from '../../../utils/appError.js';
import logger from '../../../utils/logger.js';

class GeminiProvider {
  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // Use gemma-4-31b-it since user's free tier quota for gemini models is 0
    this.model = this.genAI.getGenerativeModel({ model: 'gemma-4-31b-it' });
    this.fallbackModel = this.genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });
  }

  /**
   * Generates a code review using the Gemini model
   * Automatically retries with exponential backoff on rate limit errors (429)
   */
  async generateReview(prompt) {
    // Try primary model first, then fallback
    const models = [this.model, this.fallbackModel];
    
    for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
      const model = models[modelIdx];
      const modelName = modelIdx === 0 ? 'gemma-4-31b-it' : 'gemma-4-26b-a4b-it';
      
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          logger.info(`Gemini attempt ${attempt + 1} with ${modelName}`);
          
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });

          const response = await result.response;
          const rawText = response.text();
          const usageMetadata = response.usageMetadata || {};

          return {
            rawResponse: rawText,
            promptTokens: usageMetadata.promptTokenCount || 0,
            completionTokens: usageMetadata.candidatesTokenCount || 0,
          };
        } catch (error) {
          const is429 = error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');
          
          const is404 = error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('no longer available');

          if (is429 && attempt < 2) {
            // Exponential backoff: 10s, 30s
            const waitMs = (attempt + 1) * 10000;
            logger.warn(`Rate limit hit on ${modelName}, waiting ${waitMs}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
            continue;
          }
          
          if (is429 || is404) {
            logger.warn(`${modelName} failed (${is429 ? 'Rate Limit' : 'Not Found'}), trying fallback...`);
            break; // try next model
          }
          
          throw new AppError(`AI Provider Error: ${error.message}`, 502);
        }
      }
    }
    
    throw new AppError('AI service is currently rate limited. Please try again in a few minutes.', 429);
  }
}

export default new GeminiProvider();
