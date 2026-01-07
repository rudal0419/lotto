import { GoogleGenAI } from "@google/genai";

export const getLuckyFortune = async (numbers: number[], manualKey?: string): Promise<string> => {
  // 사용자가 입력한 키를 우선적으로 사용합니다.
  let apiKey = manualKey;
  
  // 수동 입력 키가 없는 경우 환경 변수에서 시도합니다.
  if (!apiKey) {
    try {
      apiKey = process.env.API_KEY;
    } catch (e) {
      apiKey = undefined;
    }
  }

  if (!apiKey) {
    console.warn("API Key is missing.");
    return "API_KEY_ERROR: No key found.";
  }

  // 매 요청마다 새로운 인스턴스를 생성하여 최신 키를 반영합니다.
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
        // Gemini 3 모델에서 maxOutputTokens 사용 시 thinkingBudget 설정 권장
        thinkingConfig: { thinkingBudget: 100 },
      }
    });

    // .text는 메서드가 아닌 속성입니다.
    return response.text || "행운이 당신을 기다리고 있습니다! 오늘 하루 멋진 일이 생길 것 같아요.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errorMsg = error?.message || "";
    if (errorMsg.includes("API key not valid") || errorMsg.includes("Requested entity was not found")) {
       return "API_KEY_ERROR: Invalid or missing key.";
    }
    return "오늘의 번호가 당신의 운명을 바꿀지도 모릅니다. 행운을 빌어요!";
  }
};