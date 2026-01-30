import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronUp, ChevronDown } from 'lucide-react';

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
      textareaRef.current.style.height = `${Math.min(scrollHeight, 140)}px`;
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
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 relative">
      <div className="flex justify-center mb-3">
        <button 
          onClick={onToggleSuggestions}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white/50 border border-black/5 text-slate-500 hover:bg-white/80 transition-all text-[11px] font-bold shadow-sm ios-blur"
        >
          {showSuggestions ? (
            <><span>질문 숨기기</span><ChevronDown size={14} /></>
          ) : (
            <><span>도움이 되는 질문 보기</span><ChevronUp size={14} /></>
          )}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showSuggestions ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(s)}
              className="w-full text-[13px] px-3 py-3.5 rounded-[18px] bg-white border border-slate-100 text-[#1C1C1E] hover:border-[#007AFF] hover:text-[#007AFF] transition-all flex items-center justify-center shadow-sm font-semibold active:scale-[0.96] text-center break-keep"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative flex items-end w-full bg-[#E9E9EB]/60 backdrop-blur rounded-[28px] p-1.5 border border-black/5 focus-within:bg-white focus-within:border-slate-300 transition-all group">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요"
          disabled={disabled}
          className="w-full pl-4 pr-12 py-2.5 resize-none bg-transparent outline-none text-[#1C1C1E] text-[17px] max-h-[140px] leading-tight placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={`mb-0.5 mr-0.5 p-2 rounded-full transition-all active:scale-90 ${
            input.trim() && !disabled
              ? 'bg-[#007AFF] text-white shadow-md'
              : 'bg-slate-300 text-white cursor-not-allowed opacity-40'
          }`}
        >
          <Send size={20} fill="currentColor" />
        </button>
      </div>
      
      <div className="text-center mt-3 mb-2">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-50">
          Official AI Support Agent
        </p>
      </div>
    </div>
  );
};

export default ChatInput;