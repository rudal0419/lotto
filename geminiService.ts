import { GoogleGenAI } from "@google/genai";

export const getLuckyFortune = async (numbers: number[], manualKey?: string): Promise<string> => {
  // 사용자가 입력한 키가 있으면 우선 사용하고, 없으면 환경 변수를 확인합니다.
  const apiKey = manualKey || process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key is missing.");
    return "API_KEY_ERROR: No key found.";
  }

  // 매 요청마다 전달받은 키로 새로운 인스턴스를 생성합니다.
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a charismatic lottery fortune teller. These are the 6 lotto numbers drawn: ${numbers.join(', ')}. 
      Give a short, energetic, and positive 2-sentence fortune analysis in Korean for the user. 
      Make it feel mystical but fun.`,
      config: {
        temperature: 0.9,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 100 },
      }
    });

    return response.text || "행운이 당신을 기다리고 있습니다! 오늘 하루 멋진 일이 생길 것 같아요.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // 키가 유효하지 않거나 권한 문제가 있을 때 에러를 반환합니다.
    if (error?.message?.includes("API key not valid") || error?.message?.includes("Requested entity was not found")) {
       return "API_KEY_ERROR: Invalid or missing key.";
    }
    return "오늘의 번호가 당신의 운명을 바꿀지도 모릅니다. 행운을 빌어요!";
  }
};