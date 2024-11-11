import React, { useState, useCallback } from 'react';
import { Theme } from '@radix-ui/themes';
import { FaComments, FaPaperPlane } from 'react-icons/fa';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { ChatWidgetProps, ChatMessage } from '../types';

const ISUChatWidget: React.FC<ChatWidgetProps> = ({
  endpoint = '/api/chat',
  position = 'bottom-right',
  title = 'ISU Extension Chat',
  theme = {
    primary: '#C8102E',    // ISU Cardinal
    secondary: '#F1BE48',  // ISU Gold
  },
  onMessage,
  avatar = '/favicon.ico'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response: string;
      
      if (onMessage) {
        response = await onMessage(inputMessage);
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputMessage })
        });
        response = await res.text();
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, endpoint, onMessage, isLoading]);

  return (
    <Theme>
      <div
        style={{
          position: 'fixed',
          [position]: '20px',
          bottom: '20px',
          zIndex: 9999,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              [position]: '0',
              width: '360px',
              height: '560px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div
              style={{
                background: theme.primary,
                color: 'white',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{title}</span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <Cross2Icon />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px'
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: msg.role === 'user' ? theme.primary : '#f0f0f0',
                      color: msg.role === 'user' ? 'white' : 'black'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                gap: '8px'
              }}
            >
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: theme.primary,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? '...' : <FaPaperPlane />}
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
          }}
        >
          <img
            src={avatar}
            alt="Chat"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%'
            }}
          />
          <span>Chat with us</span>
          <FaComments />
        </button>
      </div>
    </Theme>
  );
};

export default ISUChatWidget;