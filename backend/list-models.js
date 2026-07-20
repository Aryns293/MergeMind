import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './src/config/env.js';

async function listAvailableModels() {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  
  // Note: the listModels API is technically not exposed cleanly in the @google/generative-ai SDK directly,
  // but we can fetch it via fetch API manually to guarantee we see exactly what the key has access to.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
  const data = await response.json();
  
  if (data.models) {
    console.log("Available Models:");
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } else {
    console.error("Error fetching models:", data);
  }
}

listAvailableModels();
