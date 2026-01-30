
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronRight, Info, BookOpen, MessageSquare, AlertCircle, Bot, X, Menu, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
        content: `반갑습니다! **2025년 배리어프리 키오스크 지원사업** 상담 비서입니다. 🦾

소상공인 매장에 장애인·노약자가 편리하게 이용할 수 있는 키오스크 도입을 지원합니다.

**무엇이 궁금하신가요?**
• 지원 대상 및 자격 확인
• 최대 지원 금액과 자부담 비율
• 필수 기능 및 설치 절차`,
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
        error: err.message || '오류가 발생했습니다.',
      }));
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#F2F2F7] text-[#1C1C1E] overflow-hidden font-sans">
      <ProcessModal isOpen={showProcessModal} onClose={() => setShowProcessModal(false)} />

      {/* Cover Page Overlay - iOS 느낌의 깔끔한 시작화면 */}
      {showCover && (
        <div className="fixed inset-0 z-50 flex flex-col items-center bg-white px-8 py-20 text-center animate-ios-in overflow-y-auto custom-scrollbar">
          <div className="my-auto max-w-lg w-full">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#007AFF] rounded-[24px] text-white mb-8 shadow-2xl shadow-blue-200">
              <Sparkles size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1C1C1E] mb-4 tracking-tight break-keep">
              2025 배리어프리 키오스크 지원사업
            </h1>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed break-keep font-medium">
              궁금한 점을 채팅으로 물어보고 <br/> 바로 지원 자격을 확인해보세요.
            </p>
            <button 
              onClick={() => setShowCover(false)}
              className="w-full md:w-auto px-10 py-4 bg-[#007AFF] text-white rounded-[18px] font-bold text-lg hover:bg-[#0062CC] transition-all shadow-xl shadow-blue-100 flex items-center justify-center mx-auto"
            >
              상담 시작하기
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pt-12 border-b border-slate-100">
          <h2 className="text-2xl font-extrabold text-[#1C1C1E]">메뉴</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <a href="https://www.sbiz.or.kr/smst/fileManager/viewer/1741309670019/index.jsp" target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-[#007AFF]/5 text-[#007AFF] font-bold text-sm">
            <div className="flex items-center space-x-3">
              <BookOpen size={20} />
              <span>전체 공고문</span>
            </div>
            <ChevronRight size={16} />
          </a>
          <button onClick={() => setShowProcessModal(true)} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-sm">
            <div className="flex items-center space-x-3">
              <HelpCircle size={20} className="text-slate-400" />
              <span>지원사업 추진 절차</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* iOS Blur Header */}
        <header className="sticky top-0 z-10 px-6 py-4 ios-blur border-b border-black/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-1 text-[#007AFF]" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Support AI</h1>
              <h2 className="text-lg font-bold text-[#1C1C1E] leading-tight">키오스크 지원 상담</h2>
            </div>
          </div>
          <button 
            onClick={() => setShowProcessModal(true)}
            className="w-10 h-10 flex items-center justify-center text-[#007AFF] bg-blue-50 rounded-full active:scale-90 transition-transform"
          >
            <Info size={22} />
          </button>
        </header>

        {/* Message Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-4 custom-scrollbar"
        >
          <div className="max-w-3xl mx-auto space-y-1">
            {state.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {state.isLoading && (
              <div className="flex items-start mb-6 animate-ios-in">
                <div className="flex-shrink-0 flex items-end mb-1 mr-2">
                  <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                     <Bot size={14} />
                  </div>
                </div>
                <div className="bg-[#E9E9EB] px-4 py-3 rounded-[20px] rounded-bl-[4px]">
                  <div className="flex space-x-1.5 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="pb-safe">
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
