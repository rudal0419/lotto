
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLuckyFortune = async (numbers: number[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a charismatic lottery fortune teller. These are the 6 lotto numbers drawn: ${numbers.join(', ')}. 
      Give a short, energetic, and positive 2-sentence fortune analysis in Korean for the user. 
      Make it feel mystical but fun.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 150,
      }
    });

    return response.text || "행운이 당신을 기다리고 있습니다! 오늘 하루 멋진 일이 생길 것 같아요.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "이 번호들은 당신에게 큰 행운을 가져다줄 징조입니다!";
  }
};
