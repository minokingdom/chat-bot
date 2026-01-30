import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronRight, BookOpen, Menu, ArrowRight, Sparkles, Info } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ProcessModal from './components/ProcessModal';
import { getChatResponse } from './services/gemini';
import { ChatMessage as ChatMessageType, AppState } from './types';

const App: React.FC = () => {
  const [showCover, setShowCover] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [state, setState] = useState<AppState>({
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `안녕하세요! **2025년 배리어프리 키오스크 지원사업** 상담 AI입니다. 🦾

소상공인 매장을 위한 스마트상점 기술보급 사업 정보를 안내해 드릴게요.`,
        timestamp: new Date(),
      }
    ],
    isLoading: false,
    error: null,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isLoading]);

  const handleSendMessage = async (content: string) => {
    if (showCover) setShowCover(false);
    setShowSuggestions(false);

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await getChatResponse(content, state.messages);
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        groundingLinks: response.links,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || '상담 중 일시적인 오류가 발생했습니다.',
      }));
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#F2F2F7] text-[#1C1C1E] overflow-hidden font-sans select-none">
      <ProcessModal isOpen={showProcessModal} onClose={() => setShowProcessModal(false)} />

      {/* 커버 페이지 - 버튼 사이즈 및 레이아웃 복구 */}
      {showCover && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center bg-white px-8 py-20 text-center animate-ios overflow-y-auto custom-scrollbar">
          <div className="my-auto max-w-lg w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#007AFF] rounded-[24px] text-white mb-8 shadow-2xl shadow-blue-200">
              <Sparkles size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1C1C1E] mb-5 tracking-tight break-keep leading-tight">
              2025 스마트상점 <br /> 배리어프리 키오스크
            </h1>
            <p className="text-[17px] text-slate-500 mb-12 leading-relaxed break-keep font-medium">
              매뉴얼을 학습한 AI가 <br /> 지원사업의 모든 것을 실시간 안내합니다.
            </p>
            {/* 버튼 사이즈 복구: px-10 py-4, max-w-xs */}
            <button
              onClick={() => setShowCover(false)}
              className="w-full max-w-xs px-10 py-4 bg-[#007AFF] text-white rounded-[18px] font-bold text-[17px] hover:bg-[#0062CC] transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center mx-auto"
            >
              상담 시작하기
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      )}

      {/* 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden transition-opacity duration-300" onClick={toggleSidebar} />
      )}

      {/* 사이드바 메뉴 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#F9F9F9] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 border-r border-black/5 shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pt-12">
          <h2 className="text-2xl font-black text-[#1C1C1E]">메뉴</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2.5 overflow-y-auto custom-scrollbar">
          <a href="https://www.sbiz.or.kr/smst/fileManager/viewer/1741309670019/index.jsp" target="_blank" className="flex items-center justify-between p-4.5 rounded-[20px] bg-white text-[#1C1C1E] font-bold text-[14px] shadow-sm active:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#007AFF] rounded-xl text-white">
                <BookOpen size={18} />
              </div>
              <span>공식 공고문 보기</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </a>
          <button onClick={() => { setShowProcessModal(true); setIsSidebarOpen(false); }} className="w-full flex items-center justify-between p-4.5 rounded-[20px] bg-white text-[#1C1C1E] font-bold text-[14px] shadow-sm active:bg-slate-50 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#34C759] rounded-xl text-white">
                <HelpCircle size={18} />
              </div>
              <span>사업신청 메뉴얼</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        </nav>
        <div className="p-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center opacity-40">
          Sbiz Assistant
        </div>
      </aside>

      {/* 메인 UI */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* iOS Blur 헤더 */}
        <header className="sticky top-0 z-10 px-6 py-4.5 ios-blur border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-1 text-[#007AFF] active:opacity-50 transition-opacity" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-[10px] font-black text-[#007AFF] uppercase tracking-[0.15em] leading-none mb-1">AI Assistant</h1>
              <h2 className="text-[18px] font-extrabold text-[#1C1C1E] tracking-tight">키오스크 지원 상담</h2>
            </div>
          </div>
          <button
            onClick={() => setShowProcessModal(true)}
            className="w-10 h-10 flex items-center justify-center text-[#007AFF] bg-[#007AFF]/5 rounded-full active:scale-90 transition-all shadow-sm"
          >
            <Info size={22} />
          </button>
        </header>

        {/* 메시지 리스트 */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-5 custom-scrollbar scroll-smooth bg-transparent"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 opacity-30">
              <span className="text-[10px] font-black bg-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
            </div>

            <div className="space-y-1">
              {state.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {state.isLoading && (
                <div className="flex items-start mb-6 animate-ios">
                  <div className="flex-shrink-0 flex items-end mb-1 mr-2">
                    <div className="w-8 h-8 bg-[#E9E9EB] rounded-full flex items-center justify-center text-slate-400">
                      <Sparkles size={16} />
                    </div>
                  </div>
                  <div className="bg-[#E9E9EB] px-4 py-2.5 rounded-[20px] rounded-bl-[4px]">
                    <div className="flex space-x-1.5 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {state.error && (
              <div className="flex justify-center my-6">
                <div className="bg-red-50/80 backdrop-blur text-red-600 px-5 py-2.5 rounded-[18px] text-[13px] font-bold shadow-sm border border-red-100">
                  ⚠️ {state.error}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 입력바 */}
        <div className="bg-gradient-to-t from-[#F2F2F7] via-[#F2F2F7]/95 to-transparent pt-3 pb-safe">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={state.isLoading}
            showSuggestions={showSuggestions}
            onToggleSuggestions={() => setShowSuggestions(!showSuggestions)}
          />
        </div>
      </main>
    </div>
  );
};

export default App;