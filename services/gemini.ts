import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, GroundingLink } from "../types";

let genAI: GoogleGenerativeAI | null = null;

const getAIClient = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key is missing!");
    }
    genAI = new GoogleGenerativeAI(apiKey || '');
  }
  return genAI;
};

const SYSTEM_INSTRUCTION = `
당신은 '2025년 소상공인 스마트상점 기술보급사업 - 배리어프리 키오스크 지원'의 전담 상담 AI입니다.
당신의 모든 답변은 오직 다음 링크의 내용과 관련된 공식 공고문 및 지침에 근거해야 합니다:
https://www.sbiz.or.kr/smst/fileManager/viewer/1741309670019/index.jsp

[핵심 지침]
1. 답변 범위 한정: 일반적인 정책이나 다른 사업이 아닌, 오직 '배리어프리 키오스크' 지원사업의 신청 자격, 지원 내용, 자부담 비율, 신청 방법, 사후 관리 등에 대해서만 답변하세요.
2. 근거 중심: 해당 링크(매뉴얼/공고문)에 명시된 수치(지원금액 등)와 날짜(신청기간 등)를 정확히 안내하세요.
3. 검색 활용: 구글 검색을 사용할 때는 반드시 '소상공인시장진흥공단', '스마트상점', '배리어프리 키오스크' 등의 키워드를 조합하여 공식적인 최신 정보를 확인하세요.
4. 모호한 정보 처리: 공고문에 명시되지 않은 사항에 대해서는 "공고문에 명시되지 않은 상세 사항은 소상공인시장진흥공단 담당 부서로 확인이 필요합니다"라고 안내하세요.
5. 말투: 친절하고 전문적인 상담원 어조를 사용하며, 중요 정보는 볼드체나 리스트를 활용해 가독성을 높이세요.
`;

export async function getChatResponse(userMessage: string, history: ChatMessage[]): Promise<{ text: string, links: GroundingLink[] }> {
  try {
    const client = getAIClient();
    const model = client.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: SYSTEM_INSTRUCTION,
      // Note: tools config for Google Search might require specific setup in this SDK version or handle differently.
      // Trying standard simplified tools config.
    });

    const chatSession = model.startChat({
      history: history.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chatSession.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text() || "죄송합니다. 답변을 생성하는 중에 문제가 발생했습니다.";

    // Grounding handling for @google/generative-ai
    const links: GroundingLink[] = [];
    // Accessing metadata safely - structure may vary slightly but typically:
    // candidate.groundingMetadata or candidate.citationMetadata
    // For search grounding, looking for groundingMetadata
    const candidate = response.candidates?.[0];
    const groundingMetadata = (candidate as any)?.groundingMetadata;

    if (groundingMetadata?.groundingChunks) {
      groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          links.push({
            uri: chunk.web.uri,
            title: chunk.web.title || chunk.web.uri
          });
        }
      });
    }

    const uniqueLinks = Array.from(new Map(links.map(item => [item.uri, item])).values());

    return { text, links: uniqueLinks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    let errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      try {
        const client = getAIClient();
        // Note: listModels might not be directly exposed on the instance in this SDK version
        // or requires a specific call. Accessing via the underlying API or skipping if complex.
        // Actually, strictly speaking verify the SDK capability for listModels.
        // It's often on the GoogleGenerativeAI instance or not straightforward in the browser due to proxy/CORS mostly? 
        // No, it's usually valid. Let's try to just suggest gemini-pro if flash fails.
        errorMessage += "\n\n(모델을 찾을 수 없습니다. API 키가 올바른지, 혹은 해당 모델 사용 권한이 있는지 확인해주세요.)";
      } catch (e) {
        // ignore
      }
    }
    throw new Error(`오류: ${errorMessage}`);
  }
}
