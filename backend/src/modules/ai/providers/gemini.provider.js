import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../config/env.js';
import AppError from '../../../utils/appError.js';

class GeminiProvider {
  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    // Using gemini-2.5-flash as it is fast, cost-effective, and usually has free-tier quota
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * Generates a code review using the Gemini model
   * @param {string} prompt - The full prompt including instructions and git diff
   * @returns {Promise<{rawResponse: string, promptTokens: number, completionTokens: number}>}
   */
  async generateReview(prompt) {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json', // Forces structured JSON output
          temperature: 0.2, // Low temperature for more analytical responses
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
      throw new AppError(`AI Provider Error: ${error.message}`, 502);
    }
  }
}

export default new GeminiProvider();
