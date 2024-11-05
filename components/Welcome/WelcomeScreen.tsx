'use client'

import React, { useState, useRef } from 'react';
import { Box, Button, Card, Flex, Text, IconButton, Tooltip, ScrollArea } from '@radix-ui/themes';
import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { FaBuilding } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import ContentEditable from "react-contenteditable";
import {
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

const HTML_REGULAR = /<(?!img|table|\/table|thead|\/thead|tbody|\/tbody|tr|\/tr|td|\/td|th|\/th|br|\/br).*?>/gi;

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
  isLoading: boolean;
}

const WelcomeScreen = ({ onSuggestionClick, isLoading }: WelcomeScreenProps) => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef<HTMLElement>(null);

  const suggestions = [
    {
      icon: <HomeIcon className="size-5" />,
      title: "Rural Housing Readiness Assessment",
      description: "Learn about RHRA program",
      prompt: "You are an AI assitant to help answer question about Rural Housing Readiness Assessment program which is part of Iowa State University Extensions and Outreach"
    },
    {
      icon: <FaBuilding className="size-5" />,
      title: "Population in Iowa's Counties",
      description: "Census 2020: Population in Iowa's Counties",
      prompt: "You are an AI assitant to help answer question about Population in Iowa's Counties program which is part of Iowa State University Extensions and Outreach's Indicators Program"
    },
    {
      icon: <ChatBubbleIcon className="size-5" />,
      title: "Housing Needs Assessment",
      description: "Get help with housing assessments and fairness prgrams",
      prompt: "You are an AI assitant to help answer question about Housing needs assessment"
    }
  ];

  const handleSendMessage = (e: any) => {
    if (!isLoading) {
      e.preventDefault();
      const input = textAreaRef.current?.innerHTML?.replace(HTML_REGULAR, "") || "";

      if (input.length < 1) {
        return;
      }

      onSuggestionClick(input);
      setMessage('');
    }
  };

  const handleKeypress = (e: any) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      handleSendMessage(e);
      e.preventDefault();
    }
  };

  return (
    <Box className="flex flex-col h-full">
      {/* Main Content */}
      <ScrollArea
        className="flex-1 px-4 md:p-8 max-w-5xl mx-auto"
        type="auto"
        scrollbars="vertical"
        style={{ height: "100%" }}
      >
        <Card className="mb-8 p-6 welcome-card bg-white dark:bg-gray-900 border border-[#9B945F] dark:border-[#524727]">
          <Flex direction="column" gap="4">
            <Text
              size="8"
              weight="bold"
              align="center"
              className="text-[#C8102E] dark:text-[#F1BE48]"
            >
              Welcome to Iowa State University Extensions and Outreach
            </Text>
            <Text
              size="4"
              align="center"
              className="text-[#524727] dark:text-[#CAC7A7]"
            >
              Community and Economic Development (CED)
            </Text>
            <Text
              align="center"
              className="max-w-2xl mx-auto text-[#524727] dark:text-[#CAC7A7]"
            >
              Ask me about housing, community development, and rural initiatives in Iowa.
              I'm here to help you find information about ISU Extension's programs and services.
            </Text>
          </Flex>
        </Card>

        <Text
          size="6"
          weight="medium"
          className="mb-4 text-[#524727] dark:text-[#F1BE48]"
        >
          Suggested Topics
        </Text>

        <Flex gap="4" wrap="wrap" className="mb-8">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="flex-1 min-w-[250px] cursor-pointer transition-all duration-200 
                     hover:shadow-md border border-[#9B945F] dark:border-[#524727]
                     hover:transform hover:-translate-y-1 bg-white dark:bg-gray-900"
              onClick={() => !isLoading && onSuggestionClick(suggestion.prompt)}
            >
              <Flex direction="column" gap="3" className="p-4">
                <Flex
                  align="center"
                  justify="center"
                  className="w-10 h-10 rounded-full bg-[#CAC7A7] dark:bg-[#524727]"
                >
                  <div className="text-[#C8102E] dark:text-[#F1BE48]">
                    {suggestion.icon}
                  </div>
                </Flex>
                <Text
                  weight="bold"
                  className="text-[#524727] dark:text-[#F1BE48]"
                >
                  {suggestion.title}
                </Text>
                <Text
                  size="2"
                  className="text-[#524727] dark:text-[#CAC7A7]"
                >
                  {suggestion.description}
                </Text>
                <Button
                  variant="soft"
                  className="w-full mt-2 bg-[#C8102E] hover:bg-[#A00C24] text-white
                         dark:bg-[#524727] dark:hover:bg-[#3E3415]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Ask about this'}
                </Button>
              </Flex>
            </Card>
          ))}
        </Flex>
      </ScrollArea>

      <div className="px-4 pb-3">
        <Flex align="end" justify="between" gap="3" className="relative">
          <div
            className="rt-TextAreaRoot rt-r-size-1 rt-variant-surface flex-1 rounded-3xl chat-textarea"
            style={{ position: "relative" }}
          >
            <ContentEditable
              innerRef={textAreaRef}
              style={{
                minHeight: "24px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              className="rt-TextAreaInput text-base"
              html={message}
              disabled={isLoading}
              onChange={(e) => {
                const value = e.target.value.replace(HTML_REGULAR, "");
                setMessage(value);
              }}
              onKeyDown={(e) => {
                handleKeypress(e);
              }}
            />
            <div className="rt-TextAreaChrome"></div>
          </div>
          <Flex gap="3" className="absolute right-0 pr-4 bottom-2 pt">
            {isLoading && (
              <Flex
                width="6"
                height="6"
                align="center"
                justify="center"
                style={{ color: "var(--accent-11)" }}
              >
                <AiOutlineLoading3Quarters className="animate-spin size-4" />
              </Flex>
            )}
            <Tooltip content={"Send Message"}>
              <IconButton
                variant="soft"
                disabled={isLoading}
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer"
                onClick={handleSendMessage}
              >
                <FiSend className="size-4" />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </div>
    </Box>
  );
};

export default WelcomeScreen;