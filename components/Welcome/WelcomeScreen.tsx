"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Text,
  IconButton,
  Tooltip,
  ScrollArea,
} from "@radix-ui/themes";
import { ChatBubbleIcon, HomeIcon } from "@radix-ui/react-icons";
import { FaBuilding } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import ContentEditable from "react-contenteditable";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const HTML_REGULAR =
  /<(?!img|table|\/table|thead|\/thead|tbody|\/tbody|tr|\/tr|td|\/td|th|\/th|br|\/br).*?>/gi;

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: any) => Promise<void>;
  isLoading: boolean;
}

const WelcomeScreen = ({
  onSuggestionClick,
  isLoading,
}: WelcomeScreenProps) => {
  const [message, setMessage] = useState("");
  const textAreaRef = useRef<HTMLElement>(null);
  const suggestions = [
    {
      icon: <HomeIcon className="size-5" />,
      title: "Rural Housing Readiness Assessment",
      description: "What is the Rural Housing Readiness Assessment program and how can it help my community?",
      question: "What is the Rural Housing Readiness Assessment program and how can it help my community?",
      answer: "The Rural Housing Readiness Assessment program helps communities assess their readiness to address housing needs. It provides a framework for communities to evaluate their housing resources, identify gaps, and develop strategies to address housing challenges. The program is designed to help communities create a comprehensive housing plan that meets the needs of residents and supports economic development. By participating in the program, communities can access technical assistance, training, and resources to help them develop and implement their housing plans.",
      prompt: "What is the Rural Housing Readiness Assessment program and how can it help my community?"
    },
    {
      icon: <FaBuilding className="size-5" />,
      title: "Population in Iowa's Counties",
      description: "Can you tell me about population changes in Iowa counties according to the 2020 Census?",
      question: "Can you tell me about population changes in Iowa counties according to the 2020 Census?",
      answer: "The 2020 Census data shows that Iowa's population has grown by 4.7% since 2010. The data also shows that some counties in Iowa have experienced significant population growth, while others have seen a decline in population. For example, Dallas County has seen a 36% increase in population, while some rural counties have seen a decline in population. The data also shows that Iowa's population is becoming more diverse, with an increase in the number of Hispanic and Asian residents. Overall, the 2020 Census data provides valuable information about population trends in Iowa and can help communities plan for the future.",
      prompt: "Can you tell me about population changes in Iowa counties according to the 2020 Census?"
    },
    {
      icon: <ChatBubbleIcon className="size-5" />,
      title: "Housing Needs Assessment",
      description: "How do I conduct a housing needs assessment for my community?",
      question: "How do I conduct a housing needs assessment for my community?",
      answer: "A housing needs assessment is a process that helps communities identify and prioritize their housing needs. It involves collecting data on the current housing stock, housing demand, and housing affordability in the community. The assessment can help communities understand the housing challenges they face and develop strategies to address them. To conduct a housing needs assessment, communities can use a variety of data sources, including census data, housing market studies, and surveys of residents. By conducting a housing needs assessment, communities can develop a better understanding of their housing needs and create a plan to address them.",
      prompt: "How do I conduct a housing needs assessment for my community?"
    },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    if (!isLoading) {
      e.preventDefault();
      const input = textAreaRef.current?.innerHTML?.replace(HTML_REGULAR, "") || "";

      if (input.length < 1) {
        return;
      }

      await onSuggestionClick({ prompt: input });
      setMessage("");
    }
  };

  const handleKeypress = async (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage(e);
    }
  };

  const handleSuggestionButtonClick = async (e: React.MouseEvent, suggestion: any) => {
    e.stopPropagation();
    if (!isLoading) {
      await onSuggestionClick(suggestion);
    }
  };

  return (
    <Box className="flex flex-col h-full">
      <ScrollArea
        className="flex-1 px-4 md:p-8 max-w-5xl mx-auto"
        type="auto"
        scrollbars="vertical"
        style={{ height: "100%" }}
      >
        <Card className="mb-8 p-6 welcome-card bg-white dark:bg-[#1a1a1a] border border-[#9B945F] dark:border-[#C8102E]">
          <Flex direction="column" gap="4">
            <Text
              size="8"
              weight="bold"
              align="center"
              className="text-[#C8102E] dark:text-[#F1BE48]"
            >
              Welcome to ISU Extension and Outreach AI Assistant
            </Text>
            <Text
              align="center"
              className="max-w-2xl mx-auto text-[#524727] dark:text-[#e5e5e5]"
            >
              Ask me about housing, community development, and rural initiatives
              in Iowa. I'm here to help you find information about ISU
              Extension's programs and services.
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
                     hover:shadow-md border border-[#9B945F] dark:border-[#C8102E]
                     hover:transform hover:-translate-y-1 bg-white dark:bg-[#1a1a1a]
                     dark:hover:bg-[#242424]"
            >
              <Flex direction="column" gap="3" className="p-4">
                <Flex
                  align="center"
                  justify="center"
                  className="w-10 h-10 rounded-full bg-[#CAC7A7] dark:bg-[#1a1a1a] dark:border dark:border-[#C8102E]"
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
                <Text size="2" className="text-[#524727] dark:text-[#e5e5e5]">
                  {suggestion.description}
                </Text>
                <button
                  className="ask-about-button"
                  disabled={isLoading}
                  onClick={(e) => handleSuggestionButtonClick(e, suggestion)}
                >
                  {isLoading ? "Processing..." : "Ask about this"}
                </button>
              </Flex>
            </Card>
          ))}
        </Flex>
      </ScrollArea>

      <div className="px-4 pb-3">
        <Flex align="end" justify="between" gap="3" className="relative">
          <div
            className="rt-TextAreaRoot rt-r-size-1 rt-variant-surface flex-1 rounded-3xl chat-textarea
                     dark:bg-[#1a1a1a] dark:border-[#C8102E]"
            style={{ position: "relative" }}
          >
            <ContentEditable
              innerRef={textAreaRef}
              style={{
                minHeight: "24px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              className="rt-TextAreaInput text-base dark:text-[#e5e5e5]"
              html={message}
              disabled={isLoading}
              onChange={(e) => {
                const value = e.target.value.replace(HTML_REGULAR, "");
                setMessage(value);
              }}
              onKeyDown={handleKeypress}
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
                className="dark:text-[#F1BE48]"
              >
                <AiOutlineLoading3Quarters className="animate-spin size-4" />
              </Flex>
            )}
            <Tooltip content="Send Message">
              <IconButton
                variant="soft"
                disabled={isLoading}
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer dark:bg-[#1a1a1a] dark:text-[#F1BE48] 
                          dark:border dark:border-[#C8102E] dark:hover:bg-[#242424]"
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