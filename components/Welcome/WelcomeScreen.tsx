import React, { useState } from 'react';
import { Box, Button, Card, Flex, Text, TextArea, ScrollArea } from '@radix-ui/themes';
import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { FaBuilding, FaPaperPlane } from 'react-icons/fa';

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
  isLoading: boolean;
}

const WelcomeScreen = ({ onSuggestionClick, isLoading }: WelcomeScreenProps) => {
  const [inputMessage, setInputMessage] = useState('');

  const suggestions = [
    {
      icon: <HomeIcon className="size-5" />,
      title: "Rural Housing Readiness Assessment",
      description: "Learn about RHRA program",
      prompt: "You are an AI assitant to help answer question about Rural Housing Readiness Assessment program which is part of Iowa State University Extensions and Outreach"
    },
    {
      icon: <FaBuilding className="size-5" />,
      title: "Population in Iowa’s Counties",
      description: "Census 2020: Population in Iowa’s Counties",
      prompt: "You are an AI assitant to help answer question about Population in Iowa’s Counties program which is part of Iowa State University Extensions and Outreach's Indicators Program"
    },
    {
      icon: <ChatBubbleIcon className="size-5" />,
      title: "Housing Needs Assessment",
      description: "Get help with housing assessments and fairness prgrams",
      prompt: "You are an AI assitant to help answer question about Housing needs assessment"
    }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      onSuggestionClick(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
        {/* <Box className="flex-1 p-4 md:p-8 max-w-5xl mx-auto"> */}
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
        {/* </Box> */}
      </ScrollArea>
      {/* Chat Input */}
      {/* NOTE: Reuse the components from Chat.tsx files */}
      {/* <Box className="px-4 pb-4">
        <Flex className="max-w-5xl mx-auto">
          <Card className="w-full p-2 border border-[#9B945F] dark:border-[#524727] rounded-2xl">
            <Flex gap="2">
              <TextArea 
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 min-h-[50px] max-h-[200px] resize-none border-none focus:ring-0"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-[#C8102E] hover:bg-[#A00C24] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">↻</span>
                ) : (
                  <FaPaperPlane className="size-4" />
                )}
              </Button>
            </Flex>
          </Card>
        </Flex>
      </Box> */}

      {/* Footer
      <Box className="w-full px-4 py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Flex direction="column" gap="2" className="max-w-5xl mx-auto text-center">
          <Text size="1" className="text-gray-600 dark:text-gray-400">
            Disclaimer: This AI assistant provides general information about ISU Extension and Outreach programs. 
            For the most accurate and up-to-date information, please contact your local ISU Extension office.
          </Text>
          <Text size="1" className="text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Iowa State University Extension and Outreach. All rights reserved.
          </Text>
        </Flex>
      </Box> */}
    </Box>
  );
};

export default WelcomeScreen;