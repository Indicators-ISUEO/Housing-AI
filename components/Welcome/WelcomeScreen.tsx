import React from 'react';
import { Flex, Heading, Text, Button } from '@radix-ui/themes';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { BsHouseDoor, BsQuestionCircle, BsFileText } from 'react-icons/bs';
import { MdAnalytics } from 'react-icons/md';

const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      icon: <FaMapMarkedAlt className="size-5" />,
      text: "Generate a housing density map",
      prompt: "Can you generate a map showing housing density in Iowa?"
    },
    {
      icon: <BsHouseDoor className="size-5" />,
      text: "Learn about RHRA program",
      prompt: "What is the Rural Housing Readiness Assessment (RHRA) program?"
    },
    {
      icon: <MdAnalytics className="size-5" />,
      text: "Housing market analysis",
      prompt: "Can you analyze the current housing market trends in Iowa?"
    },
    {
      icon: <BsFileText className="size-5" />,
      text: "Housing resources",
      prompt: "What housing resources and programs are available through ISU Extension?"
    }
  ];

  return (
    <Flex direction="column" align="center" justify="center" className="h-full text-center px-4">
      <div className="max-w-2xl w-full">
        <Heading size="6" mb="4">Welcome to ISU Extensions and Outreach - CED</Heading>
        <Text as="p" size="3" color="gray" mb="8">
          Ask me about housing programs, generate maps, or analyze housing data in Iowa
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="soft"
              className="flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => onSuggestionClick(suggestion.prompt)}
            >
              <Flex align="center" gap="3">
                <div className="text-violet-500">
                  {suggestion.icon}
                </div>
                <Text>{suggestion.text}</Text>
              </Flex>
            </Button>
          ))}
        </div>

        <Flex mt="8" gap="2" justify="center" align="center">
          <BsQuestionCircle className="size-4" />
          <Text size="2" color="gray">
            Ask me anything about housing in Iowa
          </Text>
        </Flex>
      </div>
    </Flex>
  );
};

export default WelcomeScreen;