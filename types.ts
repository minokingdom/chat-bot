
export type MessageRole = 'user' | 'assistant';

export interface GroundingLink {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  groundingLinks?: GroundingLink[];
}

export interface AppState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
