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

export async function generateNicheIdeas(interests?: string, region: string = "UK"): Promise<AINiche[]> {
  const prompt = interests 
    ? `Based on these interests: "${interests}", generate 10 profitable and unique e-commerce niche ideas for 2026 for the ${region} market. `
    : `Generate 10 highly profitable and emerging e-commerce niche ideas for 2026 for the ${region} market. `;

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

export async function generateSuppliers(productName: string, category: string): Promise<any[]> {
  const prompt = `
    You are a global sourcing agent. For the product "${productName}" in category "${category}", identify 4 high-quality manufacturers in China (Alibaba/1688 style).
    Provide data for a professional dashboard in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            factoryName: { type: Type.STRING },
            verification: { type: Type.STRING },
            priceRange: { type: Type.STRING },
            moq: { type: Type.NUMBER },
            leadTime: { type: Type.STRING },
            advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
            shippingEstimate: { type: Type.NUMBER },
            rating: { type: Type.NUMBER },
            trustScore: { type: Type.NUMBER },
            isTradeAssurance: { type: Type.BOOLEAN },
            isoCertified: { type: Type.BOOLEAN },
            onSiteChecked: { type: Type.BOOLEAN }
          },
          required: ["factoryName", "verification", "priceRange", "moq", "leadTime", "advantages", "shippingEstimate", "rating", "trustScore", "isTradeAssurance", "isoCertified", "onSiteChecked"]
        }
      }
    }
  });

  try {
    const rawText = response.text;
    return JSON.parse(rawText);
  } catch (e) {
    console.error("Failed to parse Supplier response", e);
    // Fallback Mock Data
    return [
      {
        factoryName: "Shenzhen Precision Manufacturing Co.",
        verification: "Gold Supplier 12Yrs",
        priceRange: "£2.50 - £4.80",
        moq: 500,
        leadTime: "15-20 Days",
        advantages: ["Low MOQ", "OEM Support", "Quality Control"],
        shippingEstimate: 1.20,
        rating: 4.8,
        trustScore: 92,
        isTradeAssurance: true,
        isoCertified: true,
        onSiteChecked: true
      },
      {
        factoryName: "Ningbo Global Exports Ltd.",
        verification: "Verified Pro",
        priceRange: "£1.80 - £3.50",
        moq: 1000,
        leadTime: "25-30 Days",
        advantages: ["Price Leader", "High Capacity", "Direct Factory"],
        shippingEstimate: 0.95,
        rating: 4.5,
        trustScore: 88,
        isTradeAssurance: true,
        isoCertified: false,
        onSiteChecked: true
      }
    ];
  }
}
