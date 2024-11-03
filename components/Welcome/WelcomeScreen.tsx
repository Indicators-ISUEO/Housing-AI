import React from 'react';
import { Box, Button, Card, Flex, Text } from '@radix-ui/themes';
import { ChatBubbleIcon, HomeIcon } from '@radix-ui/react-icons';
import { FaBuilding, FaBolt } from 'react-icons/fa';

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  const suggestions = [
    {
      icon: <HomeIcon className="size-5" />,
      title: "Rural Housing Rehabilitation",
      description: "Learn about housing programs and assistance",
      prompt: "What resources does ISU Extension offer for rural housing rehabilitation?"
    },
    {
      icon: <FaBuilding className="size-5" />,
      title: "Community Development",
      description: "Explore community development initiatives",
      prompt: "Can you explain ISU Extension's community development programs?"
    },
    {
      icon: <ChatBubbleIcon className="size-5" />,
      title: "Housing Needs Assessment",
      description: "Get help with housing assessments",
      prompt: "How can ISU Extension help with conducting a housing needs assessment?"
    },
    {
      icon: <FaBolt className="size-5" />,
      title: "Rural Development",
      description: "Discover rural development programs",
      prompt: "What are ISU Extension's current rural development initiatives?"
    }
  ];

  return (
    <Box className="p-4 md:p-8 max-w-5xl mx-auto">
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
      
      <Flex gap="4" wrap="wrap">
        {suggestions.map((suggestion, index) => (
          <Card
            key={index}
            className="flex-1 min-w-[250px] cursor-pointer transition-all duration-200 
                     hover:shadow-md border border-[#9B945F] dark:border-[#524727]
                     hover:transform hover:-translate-y-1 bg-white dark:bg-gray-900"
            onClick={() => onSuggestionClick(suggestion.prompt)}
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
              >
                Ask about this
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};

export default WelcomeScreen;