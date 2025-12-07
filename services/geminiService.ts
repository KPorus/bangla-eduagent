import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course, CourseModule, Quiz } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for Models
const MODEL_REASONING = 'gemini-3-pro-preview';
const MODEL_FAST = 'gemini-2.5-flash';

/**
 * Stage 1: The Researcher Agent
 * Uses Google Search to understand the topic and build a syllabus structure.
 */
export const generateCourseSyllabus = async (topic: string): Promise<Course> => {
  const systemInstruction = `
    You are an expert Education Architect and Translator for Bengali learners.
    Your goal is to create a structured learning path for a given topic (e.g., PyTorch, Kaggle Competitions, Data Science).
    
    1. Search for high-quality curricula (Kaggle Learn, Google Courses, University syllabi).
    2. Structure the course into 4-6 logical modules.
    3. TRANSLATE all titles and descriptions into natural, high-quality Bengali.
    4. Provide the original English title for reference.
  `;

  // Note: structured output config is removed here because it conflicts with googleSearch tool.
  // We rely on the prompt to enforce JSON structure.

  try {
    const response = await ai.models.generateContent({
      model: MODEL_REASONING, // Use Pro for better instruction following (JSON format) without explicit schema
      contents: `Create a comprehensive course syllabus for: "${topic}". Focus on practical skills.
      
      You must output a VALID JSON object with the following structure:
      {
        "title": "Course Title in Bengali",
        "description": "Course Overview in Bengali",
        "modules": [
          {
            "id": "module-1",
            "title": "Module Title in Bengali",
            "originalTitle": "Original English Title",
            "description": "Brief summary in Bengali",
            "duration": "10 min"
          }
        ]
      }
      
      Do NOT include markdown formatting (like \`\`\`json). Return ONLY the raw JSON string.
      `,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Enable grounding to get real syllabi info
      },
    });

    // Extract Grounding Metadata (Sources)
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => !!uri) || [];
    
    const uniqueSources = Array.from(new Set(sources)) as string[];

    let jsonStr = response.text || "{}";
    // Clean potential markdown code blocks
    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(jsonStr);
    
    return {
      topic,
      title: data.title,
      description: data.description,
      modules: data.modules.map((m: any, index: number) => ({
        ...m,
        id: m.id || `mod-${index}`,
        isLocked: false, // For demo, we unlock all
        isCompleted: false,
      })),
      totalModules: data.modules.length,
      completedModules: 0,
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Error generating syllabus:", error);
    throw new Error("Failed to generate course structure. Please try again.");
  }
};

/**
 * Stage 2: The Content Creator/Translator Agent
 * Generates detailed markdown content for a specific module in Bengali.
 */
export const generateModuleContent = async (topic: string, module: CourseModule): Promise<string> => {
  const systemInstruction = `
    You are a friendly and expert Bengali Tutor.
    Write a detailed educational lesson for the module provided.
    
    Guidelines:
    - Language: Bengali (Bangla). Use English for technical terms (e.g., 'DataFrame', 'Loss Function') where appropriate, but explain them.
    - Format: Clean Markdown. Use headers, bullet points, and code blocks.
    - Tone: Encouraging, clear, and practical.
    - Content: Include conceptual explanations and a small code example (Python) if relevant to the topic.
  `;

  const prompt = `
    Course Topic: ${topic}
    Module Title: ${module.originalTitle} (${module.title})
    Module Description: ${module.description}
    
    Please write the full lesson content for this module.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_REASONING, // Use Pro for high-quality writing and coding
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "Content generation failed.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "দুঃখিত, এই মুহূর্তের জন্য কন্টেন্ট লোড করা যাচ্ছে না। অনুগ্রহ করে পরে আবার চেষ্টা করুন। (Error loading content)";
  }
};

/**
 * Stage 3: The Examiner Agent
 * Generates a quiz based on the module content.
 */
export const generateQuiz = async (moduleTitle: string, content: string): Promise<Quiz> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING, description: "Question in Bengali" },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4 options in Bengali"
            },
            correctIndex: { type: Type.INTEGER, description: "0-3 index of correct answer" },
            explanation: { type: Type.STRING, description: "Why it is correct (in Bengali)" },
          },
          required: ["id", "question", "options", "correctIndex", "explanation"],
        },
      },
    },
    required: ["questions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Generate 3 multiple-choice questions based on this lesson content: \n\n ${content.substring(0, 5000)}`, // Truncate if too long to save tokens
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        // No tools used here, so responseSchema is valid
      },
    });

    const data = JSON.parse(response.text || "{}");
    return {
      moduleId: "unknown", // Assigned by caller
      questions: data.questions,
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Quiz generation failed.");
  }
};