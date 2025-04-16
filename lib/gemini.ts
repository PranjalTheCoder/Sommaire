import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-002",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: SUMMARY_SYSTEM_PROMPT,
            },
            {
              text: `Transform this document into an 
                            engaging, easy-to-read summary with contextually 
                            relevant emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    if (!summary) {
      throw new Error("Empty response from Gemini API");
    }
    return summary;
  } catch (error: any) {
    console.log("Gemini API Error: ", error);
    throw error;
  }
};
