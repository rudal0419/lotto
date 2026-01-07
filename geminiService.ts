
import { GoogleGenAI } from "@google/genai";

// Vite의 define 설정을 통해 주입된 값을 사용합니다.
const apiKey = process.env.API_KEY || '';

export const getLuckyFortune = async (numbers: number[]): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Fortune feature might not work.");
    return "이 번호들은 당신에게 큰 행운을 가져다줄 징조입니다!";
  }

  const ai = new GoogleGenAI({ apiKey });

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
    return "오늘의 번호가 당신의 운명을 바꿀지도 모릅니다. 행운을 빌어요!";
  }
};
