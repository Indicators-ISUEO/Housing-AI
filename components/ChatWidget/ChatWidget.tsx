'use client'

import React, { useState } from 'react';
import { Card, Flex, Text, Button, Box } from '@radix-ui/themes';
import { FaPaperPlane, FaComments } from 'react-icons/fa';
import { Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import type { ChatMessage, ChatWidgetProps } from './types';
import { Markdown } from '@/components';

const ChatWidget = ({ onSendMessage, messages, isLoading, currentMessage }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessages = () => (
    <>
      {messages.map((msg, index) => (
        <Box 
          key={index}
          className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
        >
          <Flex 
            gap="2" 
            className={msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src="/favicon.ico"
                  alt="Cy"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <Box
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-[#C8102E] text-white' 
                  : 'bg-white shadow-sm'
              }`}
            >
              <Markdown>{msg.content}</Markdown>
            </Box>
          </Flex>
        </Box>
      ))}
      {currentMessage && (
        <Box className="mb-4">
          <Flex gap="2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image 
                src="/favicon.ico"
                alt="Cy"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <Box className="inline-block p-3 rounded-lg max-w-[80%] bg-white shadow-sm">
              <Markdown>{currentMessage}</Markdown>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );

  const widget = (
    <Card className="fixed bottom-[120px] right-4 w-80 shadow-xl rounded-lg overflow-hidden z-50">
      {/* Header */}
      <Flex 
        justify="between" 
        align="center" 
        px="4" 
        py="2"
        style={{ backgroundColor: '#C8102E' }}
      >
        <Flex align="center" gap="2">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
            <Image 
              src="/favicon.ico" 
              alt="Cy" 
              width={32} 
              height={32}
              className="object-cover"
            />
          </div>
          <Text className="text-white font-bold">ISU Extension Chat</Text>
        </Flex>
        <Flex gap="2">
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-[#A00C24]"
          >
            <ChevronDownIcon />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-[#A00C24]"
          >
            <Cross2Icon />
          </Button>
        </Flex>
      </Flex>

      {/* Chat Content */}
      <Box 
        className="h-[400px] overflow-y-auto p-4"
        style={{ backgroundColor: '#f8f8f8' }}
      >
        {/* Welcome Message */}
        {messages.length === 0 && (
          <Flex gap="2" className="mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image 
                src="/favicon.ico"
                alt="Cy"
                width={32}
                height={32}
                className="object-cover"
              />
            </div>
            <Box className="bg-white p-3 rounded-lg shadow-sm flex-1">
              <Text>Welcome to ISU Extension Chat! How can I help you today?</Text>
            </Box>
          </Flex>
        )}

        {renderMessages()}
      </Box>

      {/* Input Area */}
      <Box className="p-4 border-t border-gray-200 bg-white">
        <Flex gap="2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#C8102E]"
            style={{ minHeight: '40px', maxHeight: '120px' }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend}
            style={{ backgroundColor: '#C8102E' }}
            className="flex-shrink-0 hover:bg-[#A00C24]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin">↻</span>
            ) : (
              <FaPaperPlane />
            )}
          </Button>
        </Flex>
      </Box>
    </Card>
  );

  const chatButton = (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-[#C8102E] text-white shadow-lg hover:shadow-xl z-50 rounded-full flex items-center gap-2 px-4 py-2 transition-all duration-300 hover:bg-[#A00C24]"
    >
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
        <Image 
          src="/favicon.ico" 
          alt="Chat with ISU Extension" 
          width={32} 
          height={32}
          className="object-cover"
        />
      </div>
      <span className="font-semibold whitespace-nowrap">Extension AI Assistant</span>
      <FaComments className="text-xl ml-2" />
    </button>
  );

  return isOpen ? widget : chatButton;
};

export default ChatWidget;