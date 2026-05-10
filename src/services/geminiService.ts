import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AINiche {
  name: string;
  category: string;
  reason: string;
  estimatedDifficulty: "Low" | "Medium" | "High";
  potentialRevenue: string;
  opportunityScore: number;
  breakdown?: {
    demand: number;
    competition: number;
    growth: number;
  };
}

export async function generateNicheIdeas(interests?: string): Promise<AINiche[]> {
  const prompt = interests 
    ? `Based on these interests: "${interests}", generate 5 profitable and unique e-commerce niche ideas for 2026. `
    : "Generate 5 highly profitable and emerging e-commerce niche ideas for 2026. ";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt + "Provide the output in JSON format with fields: name, category, reason, estimatedDifficulty, potentialRevenue, opportunityScore (0-100), and a breakdown object with numeric scores (0-100) for demand, competition (where 100 is low competition/good), and growth.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            reason: { type: Type.STRING },
            estimatedDifficulty: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            potentialRevenue: { type: Type.STRING },
            opportunityScore: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                demand: { type: Type.NUMBER },
                competition: { type: Type.NUMBER },
                growth: { type: Type.NUMBER },
              },
              required: ["demand", "competition", "growth"],
            },
          },
          required: ["name", "category", "reason", "estimatedDifficulty", "potentialRevenue", "opportunityScore", "breakdown"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}
