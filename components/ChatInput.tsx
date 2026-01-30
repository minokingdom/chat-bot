
import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  showSuggestions: boolean;
  onToggleSuggestions: () => void;
}

const ChatInput: React.FC<Props> = ({ onSendMessage, disabled, showSuggestions, onToggleSuggestions }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);

  const suggestions = [
    "지원 대상 확인하기",
    "최대 지원금액은?",
    "필수 사양 안내",
    "가점 항목 리스트",
    "신청 서류 다운로드"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-2 md:pb-4 relative">
      {/* 추천 질문 컨트롤 */}
      <div className="flex justify-center mb-3">
        <button 
          onClick={onToggleSuggestions}
          className="flex items-center space-x-1 px-4 py-1.5 rounded-full bg-white/80 border border-slate-100 text-slate-500 hover:bg-slate-50 transition-all text-[11px] font-bold shadow-sm ios-blur"
        >
          {showSuggestions ? (
            <><span>질문 숨기기</span><ChevronDown size={14} /></>
          ) : (
            <><span>도움이 되는 질문 보기</span><ChevronUp size={14} /></>
          )}
        </button>
      </div>

      {/* 추천 질문 그리드 - 깔끔한 카드 스타일 */}
      <div className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showSuggestions ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(s)}
              className="w-full text-[12px] px-3 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center shadow-sm font-semibold active:scale-[0.97] text-center"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      
      {/* iOS iMessage 스타일 입력바 */}
      <div className="relative flex items-end w-full bg-[#F2F2F7] rounded-[26px] p-1.5 border border-slate-200 focus-within:bg-white transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요"
          disabled={disabled}
          className="w-full pl-4 pr-12 py-2.5 resize-none bg-transparent outline-none text-slate-800 text-[16px] max-h-[140px] leading-snug placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={`mb-0.5 mr-0.5 p-2 rounded-full transition-all ${
            input.trim() && !disabled
              ? 'bg-[#007AFF] text-white shadow-sm'
              : 'bg-slate-300 text-white cursor-not-allowed opacity-40'
          }`}
        >
          <Send size={18} fill="currentColor" className="rotate-0" />
        </button>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70">
          Official Support Assistant
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
