
import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { ExternalLink, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: ChatMessageType;
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex w-full mb-5 animate-ios-in ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[88%] md:max-w-[80%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Assistant용 작은 배지 아이콘 (iOS는 말풍선 옆에 사진이나 아이콘을 작게 배치하거나 생략함) */}
        {isAssistant && (
          <div className="flex-shrink-0 flex items-end mb-1 mr-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm overflow-hidden">
               <Bot size={14} />
            </div>
          </div>
        )}
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          {/* 말풍선 디자인: iOS 스타일 곡률 및 색상 */}
          <div className={`px-4 py-2.5 rounded-[20px] shadow-sm relative overflow-hidden ${
            isAssistant 
              ? 'bg-[#E9E9EB] text-[#1C1C1E] rounded-bl-[4px]' 
              : 'bg-[#007AFF] text-white rounded-br-[4px]'
          }`}>
            <div className={`prose prose-sm md:prose-base max-w-none break-keep font-[450] ${
              isAssistant ? 'text-[#1C1C1E] prose-slate' : 'text-white'
            } 
              prose-p:leading-[1.5] prose-p:my-2.5 first:prose-p:mt-0 last:prose-p:mb-0
              prose-strong:font-bold prose-strong:text-blue-700 prose-invert:prose-strong:text-white
              prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
              prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
              prose-li:my-1 prose-li:leading-tight
              prose-headings:text-[#1C1C1E] prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-3`}>
              {isAssistant ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap leading-[1.4] tracking-tight text-[15px]">{message.content}</div>
              )}
            </div>
          </div>
          
          {/* 타임스탬프 */}
          <span className="mt-1.5 px-1 text-[10px] text-slate-400 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>

          {/* 출처/링크 섹션 */}
          {isAssistant && message.groundingLinks && message.groundingLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 w-full">
              {message.groundingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white text-blue-600 text-[11px] border border-slate-100 hover:bg-blue-50 transition-all shadow-sm group"
                >
                  <ExternalLink size={10} className="mr-1.5 text-blue-400" />
                  <span className="truncate max-w-[150px] font-semibold">{link.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
