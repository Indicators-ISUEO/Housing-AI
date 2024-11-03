'use client'

import React, { useState, useCallback } from 'react';
import ChatWidget from './ChatWidget';
import type { ChatMessage } from './types';

const ChatWidgetProvider = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = useCallback(async (content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);

    try {
      const response = await fetch('/chat', {
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

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantResponse = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            assistantResponse += chunk;

            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              
              if (lastMessage?.role === 'assistant') {
                lastMessage.content = assistantResponse;
                return [...newMessages];
              } else {
                return [...newMessages, { role: 'assistant', content: assistantResponse }];
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.'
      }]);
    }
  }, [messages]);

  return (
    <ChatWidget
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
};

export default ChatWidgetProvider;