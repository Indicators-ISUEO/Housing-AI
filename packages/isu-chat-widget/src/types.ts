export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatWidgetProps {
  endpoint?: string;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  theme?: {
    primary: string;
    secondary: string;
  };
  onMessage?: (message: string) => Promise<string>;
  avatar?: string;
  messages?: ChatMessage[];
  isLoading?: boolean;
  onSendMessage?: (content: string) => Promise<void>;
}