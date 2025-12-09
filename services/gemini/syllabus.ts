import { ai } from "./client";
import { extractJson, extractUrls, handleGeminiError } from "./utils";
import { Course, CourseModule, GroundingMetadata } from "../../types";

// Generate Course Syllabus (Outline)
// Uses gemini-2.5-flash with Google Search for up-to-date info, requesting a JSON structure.
export const generateCourseSyllabus = async (topic: string): Promise<Partial<Course>> => {
  const prompt = `
    You are an expert curriculum designer for Bengali students.
    Research the topic: "${topic}".
    Create a structured learning path for a beginner to intermediate student.
    
    Return ONLY a JSON object with the following structure:
    {
      "title": "Course Title in Bengali",
      "description": "Short description in Bengali",
      "modules": [
        {
          "title": "Module Title in Bengali",
          "description": "Brief summary of what this module covers in Bengali"
        }
      ]
    }
    
    Ensure the content is educational, structured, and strictly in the Bengali language (Bangla).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "{}";
    const data = extractJson(text);
    
    // Validate essential data exists
    if (!data.modules || !Array.isArray(data.modules) || data.modules.length === 0) {
        throw new Error("Generated course has no modules.");
    }

    const urls = extractUrls(response.candidates?.[0]?.groundingMetadata as GroundingMetadata);

    const modules: CourseModule[] = data.modules.map((m: any, index: number) => ({
      id: `mod-${Date.now()}-${index}`,
      title: m.title || `Module ${index + 1}`,
      description: m.description || "",
      isCompleted: false
    }));

    return {
      title: data.title || topic,
      description: data.description || "Generated Course",
      modules,
      groundingUrls: urls
    };

  } catch (error) {
    handleGeminiError(error, "generate syllabus");
    throw error; // Re-throw for caller
  }
};