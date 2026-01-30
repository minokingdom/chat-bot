import { ChatMessage, GroundingLink } from "../types";

const OPENROUTER_API_KEY = process.env.API_KEY || process.env.OPENROUTER_API_KEY;

const SYSTEM_INSTRUCTION = `
당신은 '2025년 소상공인 스마트상점 기술보급사업 - 배리어프리 키오스크 지원'의 전담 상담 AI입니다.
당신의 모든 답변은 오직 다음 링크의 내용과 관련된 공식 공고문 및 지침에 근거해야 합니다:
https://www.sbiz.or.kr/smst/fileManager/viewer/1741309670019/index.jsp

[핵심 지침]
1. 답변 범위 한정: 일반적인 정책이나 다른 사업이 아닌, 오직 '배리어프리 키오스크' 지원사업의 신청 자격, 지원 내용, 자부담 비율, 신청 방법, 사후 관리 등에 대해서만 답변하세요.
2. 근거 중심: 해당 링크(매뉴얼/공고문)에 명시된 수치(지원금액 등)와 날짜(신청기간 등)를 정확히 안내하세요.
3. 검색 활용: 지식이 부족하다면 거짓말하지 말고 "공고문에 명시되지 않은 사항"이라고 안내하세요.
4. 말투: 친절하고 전문적인 상담원 어조를 사용하며, 중요 정보는 볼드체나 리스트를 활용해 가독성을 높이세요.
`;

export async function getChatResponse(userMessage: string, history: ChatMessage[]): Promise<{ text: string, links: GroundingLink[] }> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("API Key가 설정되지 않았습니다. Vercel 환경변수를 확인해주세요.");
  }

  // OpenRouter expects OpenAI-compatible messages
  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history.slice(0, -1).map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    })),
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://barrier-free-kiosk.vercel.app/",
        "X-Title": "Barrier Free Kiosk Bot"
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-pro", // Reverting to stable regular Pro model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter Error:", errorData);
      throw new Error(`API Error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "죄송합니다. 답변을 생성할 수 없습니다.";

    // Note: OpenRouter doesn't typically strip citation links in standard format easily without extra plugins.
    return { text, links: [] };

  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`상담 중 오류가 발생했습니다: ${errorMessage}`);
  }
}
