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
    <div className={`flex w-full mb-3 animate-ios ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[78%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        {isAssistant && (
          <div className="flex-shrink-0 flex items-end mb-1 mr-2">
            <div className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center text-white shadow-sm">
               <Bot size={16} />
            </div>
          </div>
        )}
        
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-2.5 rounded-[22px] shadow-sm relative ${
            isAssistant 
              ? 'bg-[#E9E9EB] text-[#1C1C1E] rounded-bl-[4px]' 
              : 'bg-[#007AFF] text-white rounded-br-[4px]'
          }`}>
            <div className={`prose-ios text-[15.5px] md:text-[16px] tracking-tight ${
              isAssistant ? 'text-[#1C1C1E]' : 'text-white'
            }`}>
              {isAssistant ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              )}
            </div>
          </div>
          
          <div className="mt-1 px-1 flex items-center space-x-1 opacity-30">
            <span className="text-[10px] font-semibold">
              {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>

          {isAssistant && message.groundingLinks && message.groundingLinks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 w-full">
              {message.groundingLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 rounded-xl bg-white border border-black/5 text-[#007AFF] text-[11px] hover:bg-slate-50 transition-all shadow-sm font-bold"
                >
                  <ExternalLink size={12} className="mr-1.5" />
                  <span className="truncate max-w-[150px]">{link.title}</span>
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