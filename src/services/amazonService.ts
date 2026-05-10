import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AmazonProduct {
  name: string;
  category: string;
  bsr: string; // Best Sellers Rank
  monthlySales: string;
  revenue: string;
  rating: string;
  trend: "Rising" | "Stable" | "Explosive";
  opportunityScore: number;
  priceStability: number; // 0-100 indicating how stable the price is (Keepa-style)
  bsrHistory: number[]; // Last 7 days simulation
  price?: number;
  fees?: number;
  netProfit?: number;
  margin?: number;
  weight?: string;
  dimensions?: string;
  breakdown?: {
    demand: number;
    competition: number;
    growth: number;
  };
}

export async function fetchAmazonTrendingProducts(category: string = "All Categories", region: string = "UK"): Promise<AmazonProduct[]> {
  const currency = region === 'UK' ? 'GBP' : 'USD';
  const prompt = `
    You are an e-commerce market analyst specializing in Amazon FBA product research in the ${region} region.
    Identify 10 real-world trending product archetypes on Amazon for the category: "${category}" specifically for the ${region} marketplace.
    Consider local trends, currency (${currency}), and consumer behavior in ${region}.
    These should be high-growth, underserved niches that are currently trending in early 2026.
    Include a 'breakdown' object with numeric scores (0-100) for demand, competition, and growth.
    Also include estimated 'price', 'fees' (Amazon referral + FBA), and 'netProfit' (after COGS and fees) in ${currency}.
    Provide the output in JSON format.
  `;

  try {
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
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              bsr: { type: Type.STRING },
              monthlySales: { type: Type.STRING },
              revenue: { type: Type.STRING },
              rating: { type: Type.STRING },
              trend: { type: Type.STRING, enum: ["Rising", "Stable", "Explosive"] },
              opportunityScore: { type: Type.NUMBER },
              priceStability: { type: Type.NUMBER },
              bsrHistory: { type: Type.ARRAY, items: { type: Type.NUMBER } },
              price: { type: Type.NUMBER },
              fees: { type: Type.NUMBER },
              netProfit: { type: Type.NUMBER },
              margin: { type: Type.NUMBER },
              weight: { type: Type.STRING },
              dimensions: { type: Type.STRING },
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
            required: ["name", "category", "bsr", "monthlySales", "revenue", "rating", "trend", "opportunityScore", "priceStability", "bsrHistory", "breakdown", "price", "fees", "netProfit"]
          }
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching Amazon data:", error);
    return [];
  }
}
