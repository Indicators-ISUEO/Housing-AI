'use client'

import React, { useState, useRef } from 'react';
import { Card, IconButton, Button, Flex, Text, ScrollArea, Box, TextArea } from '@radix-ui/themes';
import { ChatBubbleIcon, Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import type { ChatMessage } from './types';

interface Props {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
}

const ChatWidget = ({ onSendMessage, messages }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputContent.trim()) {
        onSendMessage(inputContent);
        setInputContent('');
      }
    }
  };

  const handleSend = () => {
    if (inputContent.trim()) {
      onSendMessage(inputContent);
      setInputContent('');
    }
  };

  return (
    <>
      {/* Widget Button */}
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          style={{ backgroundColor: '#500000' }}
        >
          <ChatBubbleIcon className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-96 h-[600px] shadow-xl flex flex-col rounded-lg overflow-hidden z-50">
          {/* Header */}
          <Flex 
            justify="between" 
            align="center" 
            p="3" 
            style={{ backgroundColor: '#500000' }}
          >
            <Text className="text-white" weight="bold">
              ISU Extension Chat
            </Text>
            <Flex gap="2">
              <IconButton 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-red-900"
              >
                <ChevronDownIcon />
              </IconButton>
              <IconButton 
                variant="ghost" 
                onClick={() => {
                  setIsOpen(false);
                }}
                className="text-white hover:bg-red-900"
              >
                <Cross2Icon />
              </IconButton>
            </Flex>
          </Flex>

          {/* Chat Content */}
          <ScrollArea className="flex-1 p-4">
            <Flex direction="column" gap="3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] ${
                    msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-red-900 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </Flex>
          </ScrollArea>

          {/* Input Area */}
          <Flex p="3" gap="2" className="border-t dark:border-gray-800">
            <textarea
              ref={textAreaRef}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[40px] max-h-[120px] p-2 rounded-lg resize-none bg-gray-100 dark:bg-gray-800 dark:text-white border-none focus:outline-none focus:ring-1 focus:ring-red-900"
              style={{
                overflow: 'auto'
              }}
            />
            <Button 
              onClick={handleSend}
              style={{ backgroundColor: '#500000' }}
              className="shrink-0"
            >
              Send
            </Button>
          </Flex>
        </Card>
      )}
    </>
  );
};

export default ChatWidget;