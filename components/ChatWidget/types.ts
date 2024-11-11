export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatWidgetProps {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  isLoading?: boolean;
  currentMessage?: string;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}