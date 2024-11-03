'use client'

import React, { useState, useCallback } from 'react';
import ChatWidget from './ChatWidget';
import type { ChatMessage } from './types';
import toast from 'react-hot-toast';

const ChatWidgetProvider = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const userMessage: ChatMessage = {
        role: 'user',
        content
      };
      setMessages(prev => [...prev, userMessage]);

      let url = '/chat';
      const proxy_url = window.location.href;
      if (proxy_url) {
        url = proxy_url.replace("3000", "8080");
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          messages: messages,
          input: content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let assistantResponse = '';
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: ''
        };
        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantResponse += chunk;

          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: assistantResponse }
          ]);
        }
      }
    } catch (error) {
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
    />
  );
};

export default ChatWidgetProvider;