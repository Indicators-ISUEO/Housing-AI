'use client'

import React, { useState, useCallback } from 'react';
import ChatWidget from './ChatWidget';
import type { ChatMessage } from './types';
import toast from 'react-hot-toast';
import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

const ChatWidgetProvider = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const handleSendMessage = useCallback(async (input: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("https://localhost:5000/chat", {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream'
        },
      });

      if (!res.ok) {
        const statusText = res.statusText;
        const responseBody = await res.text();
        throw new Error(
          `Error with status code of ${res.status} ${statusText}: ${responseBody}`
        );
      }

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let resultContent = "";

      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;
          if (data === '[DONE]') {
            return;
          }
          try {
            setCurrentMessage((prev) => {
              resultContent = prev + data;
              return resultContent;
            });
          } catch (e) {
            console.error('Error parsing stream:', e);
          }
        }
      });

      for await (const chunk of res.body as any) {
        const str = decoder.decode(chunk).replace('[DONE]\n', '[DONE]\n\n');
        parser.feed(str);
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: resultContent }]);
        setCurrentMessage("");
      }, 1);

    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to process your request. Please try again.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  return (
    <ChatWidget
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      currentMessage={currentMessage}
    />
  );
};

export default ChatWidgetProvider;