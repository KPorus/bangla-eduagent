import { ai } from "./client";
import { extractJson, extractUrls, handleGeminiError } from "./utils";
import { QuizQuestion, GroundingMetadata } from "../../types";

// Generate Module Content & Quiz
// Uses gemini-3-pro-preview for high-quality reasoning and content generation.
export const generateModuleContent = async (
  courseTitle: string,
  moduleTitle: string,
  moduleDescription: string
): Promise<{ content: string; quiz: QuizQuestion[]; groundingUrls: string[] }> => {
  
  const prompt = `
    You are a friendly and expert tutor.
    Course: ${courseTitle}
    Module: ${moduleTitle}
    Context: ${moduleDescription}

    Task 1: Write a comprehensive, easy-to-understand educational guide for this module in Bengali (Bangla). Use Markdown formatting (headers, bullet points, bold text). Include code examples if technical.
    
    Task 2: Create a quiz of 3 multiple choice questions to test understanding.

    Return the output as a JSON object:
    {
      "content": "The full markdown content string...",
      "quiz": [
        {
          "question": "Question in Bengali",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswerIndex": 0, // 0-3
          "explanation": "Why this is correct (in Bengali)"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }] // Use search to get accurate details for the content
      }
    });

    const text = response.text || "{}";
    const data = extractJson(text);
    const urls = extractUrls(response.candidates?.[0]?.groundingMetadata as GroundingMetadata);

    return {
      content: data.content || "Content generation failed.",
      quiz: data.quiz || [],
      groundingUrls: urls
    };

  } catch (error) {
    handleGeminiError(error, "generate module content");
    throw error;
  }
};