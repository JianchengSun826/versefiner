import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Verse } from "../types";

// Schema definition for the expected JSON output
const verseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    verses: {
      type: Type.ARRAY,
      description: "List of Bible verses found in the input.",
      items: {
        type: Type.OBJECT,
        properties: {
          bookCn: { type: Type.STRING, description: "Book name in Chinese (e.g., 创世记)" },
          bookEn: { type: Type.STRING, description: "Book name in English (e.g., Genesis)" },
          chapter: { type: Type.INTEGER, description: "Chapter number" },
          verse: { type: Type.INTEGER, description: "Verse number" },
          textCn: { type: Type.STRING, description: "The scripture text in Chinese (Recovery Version preferred, or Union)" },
          textEn: { type: Type.STRING, description: "The scripture text in English (Recovery Version preferred)" },
          referenceStandard: { type: Type.STRING, description: "Standardized reference string (e.g., Gen 1:1)" },
        },
        required: ["bookCn", "bookEn", "chapter", "verse", "textCn", "textEn", "referenceStandard"],
      },
    },
  },
  required: ["verses"],
};

export const fetchVersesFromInput = async (
  inputText: string,
  imageBase64?: string
): Promise<Verse[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Construct the prompt parts
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for simplicity, works with PNG too usually
          data: imageBase64,
        },
      });
      parts.push({
        text: "Analyze this image. Identify any Bible verse references (abbreviations like 'Gen 1:1', '启一1', etc). Ignore non-biblical text.",
      });
    }

    if (inputText) {
      parts.push({
        text: `The user has provided the following Bible references: "${inputText}". Parse all references.`,
      });
    }

    parts.push({
      text: `
      Task:
      1. Identify all Bible verses requested. Handle formats like "启一1", "Gen 1:1", "Exo 2:3-5" (expand ranges), Chinese numerals, and standard abbreviations.
      2. Retrieve the actual scripture text for each verse.
      3. PREFERENCE: Use the Recovery Version (恢复本) wording if you know it, otherwise use Chinese Union Version (CUV) and English Recovery/KJV.
      4. Return a strictly structured JSON object.
      `
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: verseSchema,
        systemInstruction: "You are a precise Bible Study Assistant. Your goal is to accurately parse mixed-language Bible citations and return the full text in both Chinese and English.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const parsedData = JSON.parse(jsonText);
    return parsedData.verses || [];

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw new Error(error.message || "Failed to process request.");
  }
};