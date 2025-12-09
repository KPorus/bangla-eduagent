import { GroundingMetadata } from "../../types";

export const extractJson = (text: string): any => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting from markdown code blocks
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (innerE) {
        // Continue to step 3
      }
    }
    
    // 3. Try finding the first '{' and last '}'
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(text.substring(start, end + 1));
      } catch (finalE) {
        console.error("Failed to parse JSON segment", text);
      }
    }
    
    console.error("Failed to parse JSON from model response", text);
    throw new Error("The AI response was not in a valid format. Please try again.");
  }
};

export const extractUrls = (metadata: GroundingMetadata | undefined): string[] => {
  if (!metadata?.groundingChunks) return [];
  return metadata.groundingChunks
    .map(chunk => chunk.web?.uri)
    .filter((uri): uri is string => !!uri);
};

export const handleGeminiError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  const msg = error.message || "";
  
  if (msg.includes("429") || msg.includes("quota")) {
    throw new Error("We are experiencing high traffic. Please wait a moment and try again.");
  }
  if (msg.includes("503") || msg.includes("Service Unavailable")) {
    throw new Error("The AI service is temporarily unavailable. Please try again later.");
  }
  if (msg.includes("SAFETY")) {
    throw new Error("The content could not be generated due to safety guidelines. Please try a different topic.");
  }
  if (msg.includes("API key")) {
    throw new Error("API Key configuration error. Please check your settings.");
  }
  if (msg.includes("candidate")) {
    throw new Error("The AI could not generate a valid response for this topic. It might be too obscure or restricted.");
  }

  // Fallback generic error
  throw error instanceof Error ? error : new Error(`Failed to ${context}. Please check your connection.`);
};